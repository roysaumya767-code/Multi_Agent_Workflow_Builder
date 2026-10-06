from fastapi import FastAPI, WebSocket
from engine import execution_order, run_node

app = FastAPI()
@app.websocket("/ws/run")

async def run_websocket(i: WebSocket):
    await i.accept()
    data_json = await i.receive_json()

    if not data_json or "nodes" not in data_json or "edges" not in data_json :     
            await i.send_json({"status": "error", "error_message": "Missing nodes or edges"})  

    order = execution_order(data_json)

    if order == "LOOP_ERROR":
            await i.send_json({"status": "error", "error_message": "Workflow contains a circular loop" })

    node_outputs = {}
    node_map = {}

    for node in data_json["nodes"]:
         node_map[node["id"]]  = node
    
    for id in order:
            if id in node_map:
               node_data = node_map[id]
               await i.send_json({"node_id": id, "status": "running"})
               result = run_node(node_data, node_outputs)

               if result.get("status") == "error":
                 await i.send_json({"node_id": id, "status": "error", "error_message": result["text"]})
                 return
               
               else:
                 node_outputs[id] = result
                 await i.send_json({"node_id": id, "status": "success", "output": result})

    await i.send_json({"status": "completed"})