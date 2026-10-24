import { useEffect, useState } from 'react';
import conf from "../conf/conf";
import axios from "axios";
import { useSocket } from "../context/Socket";


import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import LLMNode from '../LLMNode';
import APINode from '../APINode';
import Condition from '../Condition';
import InputNode from '../InputNode';
import OutputNode from '../OutputNode';
import TransformNode from '../TransformNode';
import FalseTransformNode from '../FalseTransform';


const nodeTypes = {
  llm: LLMNode,
  api :APINode,
  condition: Condition,
  input: InputNode,
  output:OutputNode,
  transform:TransformNode,
  falseTransform: FalseTransformNode,




};

const nodesOption = [
  {
    type: "llm",
    label: "LLM",
    icon: "🤖",
    data: {
      model: "openai/gpt-oss-20b",
      prompt: "Explain this title in one line: {{node_2.output.text}}",
    },
  },
  {
    type: "api",
    label: "API",
    icon: "🌐",
    data: {
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    },
  },
  {
    type: "transform",
    label: "Transform",
    icon: "🔄",
    data: {
      input: "{{api_1.output.text}}",
    operation: "json_extract",
    key: "title"
    },
  },
  {
    type: "condition",
    label: "Condition",
    icon: "❓",
    data: {
       left: "{{llm_1.output}}",
    operator: "equals",
    right: "delectus"
    },
    
  },
  
{
  type: "falseTransform",
  label: "False Transform",
  icon: "❌",
  data: {
    operation: "uppercase",
    input: "condition was false",
    key: "",
  },
},
  
];

function Workflow() {
  const [nodes,setNodes, onNodesChange] = useNodesState([]);
  const [edges,setEdges,onEdgesChange]  = useEdgesState([]);
  const [jobProgress, setJobProgress] = useState(0);
const [jobResult, setJobResult] = useState(null);
const [jobError, setJobError] = useState("");
    const [showMore, setShowMore] = useState(false);
    const [jobId, setJobId] = useState();
    const [jobStatus, setJobStatus] = useState("idle");
     const socket = useSocket();
     const [nodeStatuses, setNodeStatuses] = useState({});
     



     useEffect(()=> {
      const handlesocket = (message) => {
        console.log("gfyhjk");
          console.log("LIVE MESSAGE:", message);
          setNodeStatuses((prev) => ({
      ...prev,
      [message.node_id]: {
        status: message.status,
        output: message.output,
      },
    }));
      }
       socket.on("showlive",handlesocket);
       return () =>{
          socket.off("showlive",handlesocket);
       }
     },[socket]);

  const onConnect = (connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const branch =
  sourceNode?.type === "condition"
    ? connection.sourceHandle
    : null;
    setEdges((edges) => addEdge({...connection,data: { branch },
        label: branch ?? undefined,},edges));
  };
  const updateNodeData =(nodeId, newData) => {
    setNodes((nodes)=> nodes.map((node) => node.id === nodeId?{
      ...node,
      data:{
        ...node.data,
        ...newData
      }
    } : node
    ))
  
  };
  const deleteNode = (nodeId) => {
   setNodes((nodes)=> nodes.filter((node) => node.id !== nodeId));
    setEdges((edges)=> edges.filter((edge) => edge.source !== nodeId&&edge.target !== nodeId ));


}
  const nodesWithUpdate = nodes.map ((node) => ( {
     ...node,
      data:{
        ...node.data,
         id: node.id,
    updateNodeData,
    deleteNode
        }

}))

const addNode = (nodeOption) => {
  const sameTypeNodes = nodes.filter(
  (node) => node.type === nodeOption.type
);
  const newNode = {
    id:`${nodeOption.type}_${sameTypeNodes.length + 1}`,
    type: nodeOption.type,
    position: {
      x:150+nodes.length*30,
      y:150+nodes.length*30
    },
    data: {
  ...nodeOption.data
}
  }
  setNodes((nodes) => [
      ...nodes,
      newNode
    ]);


}
const saveWorkflow = async() => {
  const workflow = {
    nodes:nodes.map((node) =>({
    id:node.id,
    type:node.type,
    config:node.data,
    position:node.position,
    })


  ),
    edges:edges.map((e) => ({
      source:e.source,
      target:e.target,
       branch: e.data?.branch ?? null,
    }))
  };
  console.log(workflow);
  try {
    console.log("VITE_PATH:", import.meta.env.VITE_PATH);
console.log("Backend URL:", conf.path);
      const response = await axios.post(
        `${conf.path}/api/workflow`,
        {
          workflow: workflow,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        console.log("happy",response.data.jobId, response.data.message);
        setJobId(response.data.jobId);
        

      }
      
      else {
        console.log("retry");
        
      }
    } catch (err) {
      console.log(err);
    }



  }
  useEffect(() => {
   if(!jobId) return;
    let timer;
    let cancelled = false;
  const handleJobProgress = async () => {
   
   try {
  
      const response = await axios.get(
        `${conf.path}/api/${jobId}`,
        {
          withCredentials: true,
        },
      );
       if(cancelled) return;

      if (response.data.success) {
       
        
        const {jobStatus,jobProgress,result} = response.data;
        setJobStatus(jobStatus);
setJobProgress(jobProgress);
        if (
          jobStatus === "completed" ||
          jobStatus === "failed"
        ) {
          setJobResult(result);
          return;

      }
    
      
      
    } }
    catch (err) {
      console.log(err);
    }
  if(!cancelled) {
timer = setTimeout(handleJobProgress, 2000); 
}

  }
  
handleJobProgress();
return () =>{
  cancelled = true;
  clearTimeout(timer);
};




},[jobId]);
  return (
  <>  
 
{/* WORKFLOW EXECUTION — TOP RIGHT */}
{jobId && (
  <div
    className="absolute top-4 right-4 z-20 w-96
    max-h-[55vh] overflow-y-auto
    rounded-2xl border border-slate-700
    bg-slate-900/95 p-7 text-white
    shadow-2xl backdrop-blur-md"
  >
    {/* Header */}
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-white">
        Workflow Execution
      </h2>

      <span
        className={`shrink-0 rounded-full px-3 py-1.5
        text-sm font-semibold ${
          jobStatus === "completed"
            ? "bg-emerald-500/20 text-emerald-400"
            : jobStatus === "failed"
            ? "bg-red-500/20 text-red-400"
            : jobStatus === "active"
            ? "bg-blue-500/20 text-blue-400"
            : "bg-amber-500/20 text-amber-400"
        }`}
      >
        {jobStatus.toUpperCase()}
      </span>
    </div>

    {/* Job ID */}
    <div className="mb-5 rounded-xl bg-slate-800 p-4">
      <p className="text-sm text-slate-400">
        Job ID
      </p>

      <p className="mt-2 break-all font-mono text-base text-slate-200">
        {jobId}
      </p>
    </div>

    {/* Progress */}
    <div className="mb-3 flex justify-between text-base">
      <span className="text-slate-300">
        Progress
      </span>

      <span className="font-bold text-white">
        {jobStatus === "completed" ? 100 : jobProgress}%
      </span>
    </div>

    <div
      className="mb-5 h-4 overflow-hidden rounded-full bg-slate-700"
      role="progressbar"
      aria-valuenow={
        jobStatus === "completed" ? 100 : jobProgress
      }
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          jobStatus === "failed"
            ? "bg-red-500"
            : jobStatus === "completed"
            ? "bg-emerald-500"
            : "bg-purple-500"
        }`}
        style={{
          width: `${
            jobStatus === "completed" ? 100 : jobProgress
          }%`,
        }}
      />
    </div>

    {/* Status message */}
    <p className="mb-5 text-base leading-relaxed text-slate-300">
      {jobStatus === "waiting" || jobStatus === "delayed"
        ? "Your workflow is waiting to execute..."
        : jobStatus === "active"
        ? "Your workflow is running..."
        : jobStatus === "completed"
        ? "Workflow completed successfully!"
        : jobStatus === "failed"
        ? "Workflow execution failed."
        : "Checking workflow status..."}
    </p>

    {/* Error */}
    {jobError && (
      <div className="mb-4 rounded-xl border border-red-500/30
        bg-red-500/10 p-4 text-sm leading-relaxed text-red-300">
        {jobError}
      </div>
    )}

    {/* Result */}
    {jobStatus === "completed" && jobResult != null && (
      <div className="rounded-xl border border-emerald-500/20
        bg-slate-800 p-4">
        <h3 className="mb-3 text-base font-bold text-emerald-400">
          Workflow Result
        </h3>

        <pre className="max-h-56 overflow-auto whitespace-pre-wrap
          break-words text-sm leading-relaxed text-slate-300">
          {typeof jobResult === "string"
            ? jobResult
            : JSON.stringify(jobResult, null, 2)}
        </pre>
      </div>
    )}
  </div>
)}

{/* NODE EXECUTION STATUS — BOTTOM RIGHT */}
<div
  className="absolute bottom-4 right-4 z-20 w-80
  max-h-[40vh] overflow-y-auto
  rounded-2xl border border-slate-700
  bg-slate-900 p-6 text-white shadow-2xl"
>
  {/* Header */}
  <div className="mb-5 flex items-center justify-between gap-2">
    <h3 className="text-xl font-bold">
      Node Execution Status
    </h3>

    <span className="rounded-lg bg-slate-800 px-3 py-1
      text-sm text-slate-300">
      {nodes.length} nodes
    </span>
  </div>

  {/* Node list */}
  <div className="space-y-3">
    {nodes.length === 0 ? (
      <p className="py-3 text-base text-slate-400">
        Add nodes to your workflow to see their status.
      </p>
    ) : (
      nodes.map((node) => {
        const status =
          nodeStatuses[node.id]?.status ?? "waiting";

        const normalizedStatus =
          status === "success" ? "completed" : status;

        return (
          <div
            key={node.id}
            className="flex items-center justify-between gap-3
              rounded-xl border border-slate-700/70
              bg-slate-800/70 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-slate-200">
                {node.id}
              </p>

              <p className="mt-1 text-sm capitalize text-slate-400">
                {node.type}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-lg px-3 py-2
                text-sm font-semibold ${
                normalizedStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : normalizedStatus === "running"
                  ? "bg-blue-500/20 text-blue-400"
                  : normalizedStatus === "failed"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {normalizedStatus}
            </span>
          </div>
        );
      })
    )}
  </div>
</div>

  <div className="flex h-screen w-screen bg-slate-950">

    {/* SIDEBAR */}
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col">

      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Workflow Builder
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Node Library
        </p>
      </div>

      {/* NODE BUTTONS */}
      <div className="space-y-2">
        {nodesOption.map((node) => (
          <button
            key={node.type}
            onClick={() => addNode(node)}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              bg-slate-800 hover:bg-slate-700
              border border-slate-700
              hover:border-purple-500
              text-slate-200
              transition duration-200
              text-left
            "
          >
            <span className="text-lg">
              {node.icon}
            </span>

            <span className="font-medium">
              {node.label}
            </span>

            <span className="ml-auto text-slate-500">
              +
            </span>
          </button>
        ))}
      </div>

      {/* MORE OPTIONS */}
      <div className="mt-4 relative">

        <button
          onClick={() => setShowMore(!showMore)}
          className="
            w-full flex justify-between items-center
            px-4 py-3 rounded-xl
            bg-slate-800
            border border-slate-700
            text-slate-300
            hover:bg-slate-700
            transition
          "
        >
          <span>More options</span>

          <span>
            {showMore ? '▲' : '▼'}
          </span>
        </button>

        {showMore && (
          <div className="
            mt-2 bg-slate-800
            border border-slate-700
            rounded-xl p-2 space-y-1
          ">
            <button className="
              w-full text-left px-3 py-2
              rounded-lg text-slate-300
              hover:bg-slate-700
            ">
              ⚙️ Settings
            </button>

            <button className="
              w-full text-left px-3 py-2
              rounded-lg text-slate-300
              hover:bg-slate-700
            ">
              📋 Templates
            </button>

            <button className="
              w-full text-left px-3 py-2
              rounded-lg text-slate-300
              hover:bg-slate-700
            ">
              📜 History
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="mt-auto space-y-3">

        <button
          onClick={saveWorkflow}
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl
            bg-purple-600 hover:bg-purple-500
            text-white font-semibold
          "
        >
          💾 Save Workflow
        </button>

        <button
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl
            bg-emerald-600 hover:bg-emerald-500
            text-white font-semibold
          "
        >
          ▶ Run Workflow
        </button>

      </div>

    </aside>

    {/* WORKSPACE */}
    <main className="flex-1 relative">

      <ReactFlow
        nodes={nodesWithUpdate}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >

        <Background />

        <Controls />

        

      </ReactFlow>

    </main>

  </div>
  </>
);
}

export default Workflow;