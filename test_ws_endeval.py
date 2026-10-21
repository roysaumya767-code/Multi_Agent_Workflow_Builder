import asyncio
import json
import websockets
 
# node_1 fetches JSON -> node_2 extracts "title" -> node_3 checks a condition
# if TRUE  -> node_4 (LLM) runs
# if FALSE -> node_5 (transform) runs
workflow = {
    "nodes": [
        {"id": "node_1", "type": "api",
         "config": {"url": "https://jsonplaceholder.typicode.com/todos/1", "retries": 2}},
        {"id": "node_2", "type": "transform",
         "config": {"input": "{{node_1.output.text}}", "operation": "json_extract", "key": "title"}},
        {"id": "node_3", "type": "condition",
         "config": {"left": "{{node_2.output.text}}", "operator": "contains", "right": "delectus"}},
        {"id": "node_4", "type": "llm",
         "config": {"prompt": "Explain this title in one line: {{node_2.output.text}}"}},
        {"id": "node_5", "type": "transform",
         "config": {"input": "condition was false", "operation": "uppercase"}},
    ],
    "edges": [
        {"source": "node_1", "target": "node_2"},
        {"source": "node_2", "target": "node_3"},
        {"source": "node_3", "target": "node_4", "branch": "true"},
        {"source": "node_3", "target": "node_5", "branch": "false"},
    ],
}
 
 
async def main():
    async with websockets.connect("ws://127.0.0.1:8000/ws/run") as i:
        await i.send(json.dumps(workflow))
 
        while True:
            message = json.loads(await i.recv())
            print(message)
            if message.get("status") in ["completed", "error"] and "node_id" not in message:
                break
            if message.get("status") == "error":
                break
  
asyncio.run(main())
 
