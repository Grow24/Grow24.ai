import { Node, Edge } from '@xyflow/react';

export const createSimpleLinearFlow = () => {
  const nodes: Node[] = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start Process' }
    },
    {
      id: 'process-1',
      type: 'action',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Validate Input',
        actionType: 'validation',
        description: 'Validate incoming data'
      }
    },
    {
      id: 'process-2',
      type: 'action',
      position: { x: 500, y: 200 },
      data: { 
        label: 'Process Data',
        actionType: 'processing',
        description: 'Transform and process data'
      }
    },
    {
      id: 'process-3',
      type: 'action',
      position: { x: 700, y: 200 },
      data: { 
        label: 'Generate Output',
        actionType: 'output',
        description: 'Generate final output'
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 900, y: 200 },
      data: { label: 'Complete' }
    }
  ];

  const edges: Edge[] = [
    {
      id: 'e1',
      source: 'start-1',
      target: 'process-1',
      type: 'straight'
    },
    {
      id: 'e2',
      source: 'process-1',
      target: 'process-2',
      type: 'straight'
    },
    {
      id: 'e3',
      source: 'process-2',
      target: 'process-3',
      type: 'straight'
    },
    {
      id: 'e4',
      source: 'process-3',
      target: 'end-1',
      type: 'straight'
    }
  ];

  return { nodes, edges };
};