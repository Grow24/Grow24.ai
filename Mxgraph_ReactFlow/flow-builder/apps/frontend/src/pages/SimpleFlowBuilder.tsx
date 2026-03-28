import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  start: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-green-100 border-2 border-green-300 rounded">
      {data.label}
    </div>
  ),
  action: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded">
      {data.label}
    </div>
  ),
};

export default function SimpleFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [draggedType, setDraggedType] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setDraggedType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    if (!draggedType) return;
    
    const position = {
      x: event.clientX - 200,
      y: event.clientY - 100,
    };
    
    const newNode: Node = {
      id: `${draggedType}-${Date.now()}`,
      type: draggedType,
      position,
      data: { label: `New ${draggedType}` },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setDraggedType(null);
  };

  const loadDemo = () => {
    setNodes([
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: 'Start' },
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 300, y: 100 },
        data: { label: 'Action' },
      },
    ]);
    setEdges([
      { id: 'e1-2', source: 'start-1', target: 'action-1' },
    ]);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        {/* Palette */}
        <div className="w-64 p-4 bg-gray-100">
          <h3 className="font-bold mb-4">Drag Nodes</h3>
          <div
            className="p-3 mb-2 bg-green-100 border rounded cursor-grab"
            draggable
            onDragStart={(e) => onDragStart(e, 'start')}
          >
            Start Node
          </div>
          <div
            className="p-3 mb-2 bg-blue-100 border rounded cursor-grab"
            draggable
            onDragStart={(e) => onDragStart(e, 'action')}
          >
            Action Node
          </div>
          <button
            onClick={loadDemo}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load Demo
          </button>
        </div>
        
        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}