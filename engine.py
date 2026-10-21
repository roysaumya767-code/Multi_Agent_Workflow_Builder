import re
import os
import json
import asyncio
import requests
import networkx as nx
from openai import AsyncOpenAI
from typing import TypedDict
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END

load_dotenv()
groq_key = os.getenv("GROQ_API_KEY")
client = None
if groq_key:
    client = AsyncOpenAI(api_key=groq_key, base_url="https://api.groq.com/openai/v1")

#Topological Sorting
def execution_order(data_json):
    graph = nx.DiGraph()

    for node in data_json.get("nodes", []):
        graph.add_node(node["id"])
    
    for edge in data_json.get("edges", []):
        graph.add_edge(edge["source"], edge["target"])

    if not nx.is_directed_acyclic_graph(graph):
      return "LOOP_ERROR"
    
    else :
      ordered_node_id = list(nx.topological_sort(graph))
      return ordered_node_id

#Variable Replacement Engine
def replace_variable(text, node_outputs):
    matches = re.findall(r"\{\{(.*?)\}\}", text)

    for m in matches:
        parts = m.strip().split(".")
        if len(parts) >=3 and parts[0] in node_outputs:
          source_id = parts[0]  
          key_name = parts[2]        

          if source_id in node_outputs:
            actual_value = node_outputs[source_id].get(key_name, "")
            pattern = "{{" + m + "}}"
            text = text.replace(pattern, str(actual_value))
    return text

#LLM Node(Innner Langgraph)
class AgentState(TypedDict):
    prompt: str
    model: str
    response: str
    tokens: int
async def call_llm(state: AgentState):
    if client is None:
        return {"response": "[Simulated LLM Output]: " + state["prompt"], "tokens": 0}
    
    completion = await client.chat.completions.create(
        model=state["model"],
        messages=[{"role": "user", "content": state["prompt"]}],
    )
    return {
        "response": completion.choices[0].message.content,
        "tokens": completion.usage.total_tokens,
    }
builder = StateGraph(AgentState)
builder.add_node("llm_node", call_llm)
builder.set_entry_point("llm_node")
builder.add_edge("llm_node", END)
agent_app = builder.compile()
  
async def run_langgraph_agent(prompt_text, model_name):
    result = await agent_app.ainvoke(
        {"prompt": prompt_text, "model": model_name, "response": "", "tokens": 0}
    )
    return result["response"], result["tokens"]

#Node Execution
async def run_once(node_data, node_outputs):
    node_type = node_data.get("type")
    config = node_data.get("config", {})
    

    #node is an HTTP API Request
    if node_type == "api":
        url = config.get("url", "")
        url = replace_variable(url, node_outputs)
        if url == "" :
            return {"text": "Error: No URL provided", "status_code": 400, "status": "error"}
        
        if not url.startswith("http"):
            return {"text": "URL must start with http or https", "status": "error"}

        response = await asyncio.to_thread(requests.get, url, timeout=5)

        if response.status_code == 200:
              return {"text": response.text, "status_code": 200, "status": "success"}
    
        return {"text": f"HTTP Error {response.status_code}", "status": "error"}  

    if node_type == "condition":
        source_id = config.get("source_id")
        field = config.get("field")
        llm_node = node_outputs.get(source_id,{})
        field = llm_node.get("text","").strip()
        value = config.get("value")
        

        
        if field == "URGENT/HIGH" :
            value = "HIGH"
            return {"status_code": 200, "status": "success","urgency":"high"}
        elif field == "LOW/NOTURGENT":
            value = "LOW"
            return {"status_code": 200, "status": "success","urgency":"low"}
        return {"status_code": 400, "status": "error","urgency":"none"}
        
            






       



        
    #node is an LLM Call - Have to implement
    elif node_type in ["llm", "agent"]:
        raw_prompt = config.get("prompt", "Hello")
        model_name = config.get("model", "openai/gpt-oss-20b")
        final_prompt = replace_variable(raw_prompt, node_outputs)

        answer, tokens = await run_langgraph_agent(final_prompt, model_name)
        return {"text": answer, "tokens": tokens, "status": "success"}

    #Data Transform Node - Have to implement
    if node_type == "transform":
        text = replace_variable(config.get("input", ""), node_outputs)
        operation = config.get("operation", "uppercase").lower()
 
        if operation == "uppercase":
            text = text.upper()
        elif operation == "lowercase":
            text = text.lower()
        elif operation == "json_extract":
            data = json.loads(text)
            text = str(data.get(config.get("key", ""), ""))
        else:
            return {"text": "Error: Unknown operation " + operation, "status": "error"}
 
        return {"text": text, "status": "success"}

    #Conditional Node
    if node_type == "condition":
        left = replace_variable(config.get("left", ""), node_outputs)
        right = replace_variable(config.get("right", ""), node_outputs)
        operator = config.get("operator", "contains")
 
        if operator == "contains":
            result = right.lower() in left.lower()
        elif operator == "equals":
            result = left == right
        else:
            return {"text": "Error: Unknown operator " + operator, "status": "error"}
 
        return {"text": str(result), "result": result, "status": "success"}
    return {"text": "Unsupported node type: " + str(node_type), "status": "error"}

#Running anode with retries
async def run_node(node_data, node_outputs):
    config = node_data.get("config", {})
    retries = config.get("retries", 0)
    delay = config.get("retry_delay", 1)
 
    result = {}
    for attempt in range(retries + 1):
        try:
            result = await run_once(node_data, node_outputs)
        except Exception as e:
            result = {"text": "Error: " + str(e), "status": "error"}
 
        if result["status"] == "success":
            break
 
        if attempt < retries:
            await asyncio.sleep(delay * (2 ** attempt))
 
    result["attempts"] = attempt + 1
    return result

#Branching
def should_skip(node_id, edges, node_outputs, skipped):
    for edge in edges:
        if edge["target"] != node_id:
            continue
 
        source = edge["source"]
        if source in skipped:
            return True
 
        branch = edge.get("branch")
        if branch is not None and source in node_outputs and "result" in node_outputs[source]:
            if str(node_outputs[source]["result"]).lower() != branch:
                return True
 
    return False

