import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import toast from 'react-hot-toast';

function getDataflowWsUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const wsPath = `${base}/ws` || '/ws';
  return `${protocol}://${window.location.host}${wsPath}`;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const { updateNodeStatus } = useWorkflowStore();

  useEffect(() => {
    const ws = new WebSocket(getDataflowWsUrl());
    
    ws.onopen = () => {
      setIsConnected(true);
      toast.success('Connected to IoT engine');
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      toast.error('Disconnected from IoT engine');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'node_status':
            updateNodeStatus(data.nodeId, data.status, data.output);
            break;
          case 'edge_active':
            // Handle edge activation visualization
            console.log('Edge active:', data.source, '->', data.target);
            break;
          case 'error':
            toast.error(data.message);
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket connection error');
    };
    
    return () => {
      ws.close();
    };
  }, [updateNodeStatus]);
  
  return { isConnected };
}