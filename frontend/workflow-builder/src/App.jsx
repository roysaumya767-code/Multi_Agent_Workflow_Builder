import { useState } from 'react';

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import LLMNode from './LLMNode';
import APINode from './APINode';
import Condition from './Condition';
import InputNode from './InputNode';
import OutputNode from './OutputNode';
import TransformNode from './TransformNode'


const nodeTypes = {
  llm: LLMNode,
  api :APINode,
  condition: Condition,
  input: InputNode,
  output:OutputNode,
  transform:TransformNode




};
const nodesOption = [
  {
    type: 'llm',
    label: 'LLM',
    icon: '🤖',
    data: {
      model: 'GPT',
      prompt: 'Summarize this email'
    }
  },

  {
    type: 'api',
    label: 'API',
    icon: '🌐',
    data: {
      method: 'GET',
      url: 'https://api.example.com/data'
    }
  },

  {
    type: 'transform',
    label: 'Transform',
    icon: '🔄',
    data: {
      operation: 'extract',
      field: 'email.body'
    }
  },

  {
    type: 'condition',
    label: 'Condition',
    icon: '❓',
    data: {
      field: 'urgency',
      operator: 'equals',
      value: 'HIGH'
    }
  },

  {
    type: 'input',
    label: 'Input',
    icon: '▶️',
    data: {
      input: 'get emails'
    }
  },

  {
    type: 'output',
    label: 'Output',
    icon: '🛑',
    data: {
      output: 'Result'
    }
  }
];

function App() {
  const [nodes,setNodes, onNodesChange] = useNodesState([]);
  const [edges,setEdges,onEdgesChange]  = useEdgesState([]);
    const [showMore, setShowMore] = useState(false);
  const onConnect = (connection) => {
    setEdges((edges) => addEdge(connection,edges));
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
  const newNode = {
    id:crypto.randomUUID(),
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
const saveWorkflow = () => {
  const workflow = {
    nodes:nodes,
    edges:edges
  };
  console.log(workflow);
}





  
  
  
  return (
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
);
}

export default App;