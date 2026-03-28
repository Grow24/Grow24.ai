import { useEffect, useState, useCallback } from 'react';
import { Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface UseYjsFlowProps {
  roomId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export const useYjsFlow = ({ roomId, initialNodes = [], initialEdges = [] }: UseYjsFlowProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://localhost:3003/yjs',
      `flow-${roomId}`,
      ydoc
    );

    const yNodes = ydoc.getArray<any>('nodes');
    const yEdges = ydoc.getArray<any>('edges');

    // Initialize with existing data if empty
    if (yNodes.length === 0 && initialNodes.length > 0) {
      ydoc.transact(() => {
        yNodes.insert(0, initialNodes);
      });
    }
    if (yEdges.length === 0 && initialEdges.length > 0) {
      ydoc.transact(() => {
        yEdges.insert(0, initialEdges);
      });
    }

    // Listen for changes
    const updateNodes = () => {
      setNodes([...yNodes.toArray()]);
    };
    const updateEdges = () => {
      setEdges([...yEdges.toArray()]);
    };

    yNodes.observe(updateNodes);
    yEdges.observe(updateEdges);

    // Initial sync
    updateNodes();
    updateEdges();

    setProvider(wsProvider);

    return () => {
      yNodes.unobserve(updateNodes);
      yEdges.unobserve(updateEdges);
      wsProvider.destroy();
    };
  }, [roomId, ydoc]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    const yNodes = ydoc.getArray<Node>('nodes');
    
    ydoc.transact(() => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'add':
            // Handle in onConnect or addNode
            break;
          case 'remove':
            const removeIndex = nodes.findIndex(n => n.id === change.id);
            if (removeIndex >= 0) {
              yNodes.delete(removeIndex, 1);
            }
            break;
          case 'position':
          case 'dimensions':
          case 'select':
            const updateIndex = nodes.findIndex(n => n.id === change.id);
            if (updateIndex >= 0) {
              const currentNode = yNodes.get(updateIndex);
              const updatedNode = { ...currentNode };
              
              if (change.type === 'position' && change.position) {
                updatedNode.position = change.position;
              }
              if (change.type === 'dimensions' && change.dimensions) {
                updatedNode.width = change.dimensions.width;
                updatedNode.height = change.dimensions.height;
              }
              if (change.type === 'select') {
                updatedNode.selected = change.selected;
              }
              
              yNodes.delete(updateIndex, 1);
              yNodes.insert(updateIndex, [updatedNode]);
            }
            break;
        }
      });
    });
  }, [ydoc, nodes]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    const yEdges = ydoc.getArray<Edge>('edges');
    
    ydoc.transact(() => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'add':
            // Handle in onConnect
            break;
          case 'remove':
            const removeIndex = edges.findIndex(e => e.id === change.id);
            if (removeIndex >= 0) {
              yEdges.delete(removeIndex, 1);
            }
            break;
          case 'select':
            const updateIndex = edges.findIndex(e => e.id === change.id);
            if (updateIndex >= 0) {
              const currentEdge = yEdges.get(updateIndex);
              const updatedEdge = { ...currentEdge, selected: change.selected };
              yEdges.delete(updateIndex, 1);
              yEdges.insert(updateIndex, [updatedEdge]);
            }
            break;
        }
      });
    });
  }, [ydoc, edges]);

  const addNode = useCallback((node: Node) => {
    const yNodes = ydoc.getArray<Node>('nodes');
    ydoc.transact(() => {
      yNodes.push([node]);
    });
  }, [ydoc]);

  const addEdge = useCallback((edge: Edge) => {
    const yEdges = ydoc.getArray<Edge>('edges');
    ydoc.transact(() => {
      yEdges.push([edge]);
    });
  }, [ydoc]);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    const yNodes = ydoc.getArray<Node>('nodes');
    const index = nodes.findIndex(n => n.id === nodeId);
    
    if (index >= 0) {
      ydoc.transact(() => {
        const currentNode = yNodes.get(index);
        const updatedNode = { ...currentNode, ...updates };
        yNodes.delete(index, 1);
        yNodes.insert(index, [updatedNode]);
      });
    }
  }, [ydoc, nodes]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    addEdge,
    updateNode,
    ydoc,
    provider,
  };
};