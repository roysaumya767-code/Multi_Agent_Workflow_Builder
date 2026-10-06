# Multi_Agent_Workflow_Builder

# Backend 
A lightweight DAG execution engine built with Python FastAPI and NetworkX.

## Core Features
- **Topological DAG Sorting**: Orders dependent node execution steps using NetworkX.
- **Variable Interpolation**: Dynamically replaces template strings (`{{node_id.output.key}}`) with upstream results.
- **Real-Time Streaming**: Pushes execution updates (`running` -> `success` / `error`) to UI via WebSockets.
- **Node Support**: API HTTP Requests (still implementing)

## Project Structure
- `engine.py`: Graph execution algorithm, string parser, and node handlers.
- `main.py`: FastAPI server and WebSocket controller.
