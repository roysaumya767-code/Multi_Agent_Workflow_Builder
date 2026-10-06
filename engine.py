import re
import requests
import networkx as nx

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
        if len(parts) >=3 :
          source_id = parts[0]  
          key_name = parts[2]        

          if source_id in node_outputs:
            actual_value = node_outputs[source_id].get(key_name, "")
            pattern = "{{" + m + "}}"
            text = text.replace(pattern, str(actual_value))
    return text

def run_node(node_data, node_outputs):
    node_type = node_data.get("type")
    config = node_data.get("config", {})

    #node is an HTTP API Request
    if node_type == "api":
        url = config.get("url", "")
        if url == "" :
            return {"text": "Error: No URL provided", "status_code": 400, "status": "error"}
        
        if not url.startswith("http"):
            return {"text": "URL must start with http or https", "status": "error"}

        response = requests.get(url, timeout=5)

        if response.status_code == 200:
              return {"text": response.text, "status_code": 200, "status": "success"}
    
        return {"text": f"HTTP Error {response.status_code}", "status": "error"}  
        
    #node is an LLM Call - Have to implement
    
    #Data Transform Node - Have to implement
    
