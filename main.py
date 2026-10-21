from fastapi import FastAPI, WebSocket
from engine import execution_order, run_once, should_skip

app = FastAPI(title="Multi-Agent Workflow Builder Backend")
@app.websocket("/ws/run")

async def run_websocket(i: WebSocket):
    await i.accept()
    data_json = await i.receive_json()

    if not data_json or "nodes" not in data_json or "edges" not in data_json :     
            await i.send_json({"status": "error", "error_message": "Missing nodes or edges"})
            await i.close()
            return

    order = execution_order(data_json)

    if order == "LOOP_ERROR":
            await i.send_json({"status": "error", "error_message": "Workflow contains a circular loop" })
            await i.close()
            return

    node_outputs = {}
    node_map = {}
    skipped = []
    total_tokens = 0

    for node in data_json["nodes"]:
         node_map[node["id"]]  = node
    
    for id in order:
        if id not in node_map:
            continue
 
        # conditional branching: skip nodes on the wrong branch
        if should_skip(id, data_json["edges"], node_outputs, skipped):
            skipped.append(id)
            await i.send_json({"node_id": id, "status": "skipped"})
            continue
 
        await i.send_json({"node_id": id, "status": "running"})
        result = await run_once(node_map[id], node_outputs)
 
        if result["status"] == "error":
            await i.send_json({
                "node_id": id,
                "status": "error",
                "error_message": result["text"],
                "attempts": result["attempts"],
            })
            await i.close()
            return
 
        node_outputs[id] = result
        total_tokens += result.get("tokens", 0)
        await i.send_json({"node_id": id, "status": "success", "output": result})
 
    await i.send_json({"status": "completed", "total_tokens": total_tokens})
    await i.close()
 