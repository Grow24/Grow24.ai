import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

function getDataflowWsUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const wsPath = `${base}/ws` || '/ws';
  return `${protocol}://${window.location.host}${wsPath}`;
}

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];
  isExecuting: boolean;
  executionId: string | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeStatus: (nodeId: string, status: string, output?: any) => void;
  executeFlow: (flow: { nodes: Node[]; edges: Edge[] }) => Promise<void>;
  setExecuting: (executing: boolean) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  isExecuting: false,
  executionId: null,
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  updateNodeStatus: (nodeId, status, output) => {
    const { nodes } = get();
    const updatedNodes = nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, status, output } }
        : node
    );
    set({ nodes: updatedNodes });
  },
  
  executeFlow: async (flow) => {
    set({ isExecuting: true, executionId: Date.now().toString() });
    
    try {
      // Send flow to backend for execution
      const ws = new WebSocket(getDataflowWsUrl());
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'execute_flow',
          flow
        }));
      };
      
      // Handle execution completion
      setTimeout(() => {
        set({ isExecuting: false, executionId: null });
      }, 5000);
      
    } catch (error) {
      console.error('Flow execution failed:', error);
      set({ isExecuting: false, executionId: null });
    }
  },
  
  setExecuting: (executing) => set({ isExecuting: executing }),
}));