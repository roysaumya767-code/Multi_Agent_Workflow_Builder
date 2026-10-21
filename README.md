# Multi_Agent_Workflow_Builder — Backend

A lightweight DAG execution engine built with Python FastAPI, NetworkX, and LangGraph.

## Core Features
- **Topological DAG Execution**: NetworkX sorts nodes in execution order and catches circular loop errors (`LOOP_ERROR`).
- **Inner Agent State Orchestration**: LangGraph (`StateGraph`) manages LLM node state and token counts.
- **Variable Interpolation**: Dynamically replaces template strings (`{{node_id.output.key}}`) using regex with upstream node outputs.
- **Conditional Branching**: Dynamic node skipping (`should_skip`) based on condition evaluation (`true`/`false` branches).
- **Retry Logic & Exponential Backoff**: Per-node configurable retries with delay scaling (`delay * 2^attempt`).
- **Real-Time Streaming**: Live WebSocket status updates (`running`, `success`, `error`, `skipped`) pushed per node.

## Supported Node Types
1. **API Node (`api`)**: Executes asynchronous HTTP GET requests using `requests` wrapped in `asyncio.to_thread`.
2. **LLM Node (`llm` / `agent`)**: Executes prompts through LangGraph using the `AsyncOpenAI` SDK pointing to Groq (`llama-3.3-70b-versatile` / `openai/gpt-oss-20b`).
3. **Data Transform Node (`transform`)**: Performs `uppercase`, `lowercase`, or JSON extraction (`json_extract` via key path).
4. **Conditional Node (`condition`)**: Evaluates `contains` or `equals` comparisons between two dynamic values to output boolean results (`true`/`false`).

## LLM Provider & Token Calculation
- **LLM Provider**: Groq API via `AsyncOpenAI` client pointing to `https://api.groq.com/openai/v1`.
- **Token Count Formula**: Token usage per LLM call is extracted directly from the Groq API completion response payload:
  $$\text{tokens} = \text{completion.usage.total\_tokens}$$
- **Total Workflow Tokens**: Summed across all executed LLM nodes during the graph run and returned in the final WebSocket completion payload:
  $$\text{total\_tokens} = \sum \text{node.tokens}$$

## Project Structure
- `main.py`: FastAPI server, WebSocket endpoint (`/ws/run`), branch evaluation, and live stream controller.
- `engine.py`: NetworkX graph topological sort, LangGraph state engine, regex string substitution, node action runners, and retry backoff logic.