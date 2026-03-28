import React, { useEffect, useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

interface ExecutionState {
  activeNodes: string[];
  completedNodes: string[];
  currentNode?: string;
  activeEdges: string[];
  completedEdges: string[];
}

interface HybridExecutionAnimatorProps {
  nodes: Node[];
  edges: Edge[];
  isExecuting: boolean;
  inputData?: any;
  onExecutionComplete: (result: any) => void;
  onExecutionStateChange: (state: ExecutionState) => void;
  speed?: number;
}

export const HybridExecutionAnimator: React.FC<HybridExecutionAnimatorProps> = ({
  nodes,
  edges,
  isExecuting,
  inputData,
  onExecutionComplete,
  onExecutionStateChange,
  speed = 1
}) => {
  const [executionState, setExecutionState] = useState<ExecutionState>({
    activeNodes: [],
    completedNodes: [],
    activeEdges: [],
    completedEdges: [],
  });

  // Find execution path
  const findExecutionPath = useCallback(() => {
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) return { nodePath: [], edgePath: [] };

    const nodePath: string[] = [startNode.id];
    const edgePath: string[] = [];
    let currentNodeId = startNode.id;

    // Simple linear path finding for demo
    while (currentNodeId) {
      const outgoingEdge = edges.find(e => e.source === currentNodeId);
      if (!outgoingEdge) break;

      edgePath.push(outgoingEdge.id);
      nodePath.push(outgoingEdge.target);
      currentNodeId = outgoingEdge.target;

      const targetNode = nodes.find(n => n.id === outgoingEdge.target);
      if (targetNode?.type === 'end') break;
    }

    return { nodePath, edgePath };
  }, [nodes, edges]);

  // Execute animation sequence
  const executeAnimation = useCallback(async () => {
    if (!isExecuting) return;

    const { nodePath, edgePath } = findExecutionPath();
    if (nodePath.length === 0) return;

    console.log('🎬 Starting hybrid execution animation:', { nodePath, edgePath });

    // Reset state
    setExecutionState({
      activeNodes: [],
      completedNodes: [],
      activeEdges: [],
      completedEdges: [],
    });

    const baseDelay = 1000 / speed;

    for (let i = 0; i < nodePath.length; i++) {
      if (!isExecuting) break;

      const nodeId = nodePath[i];
      const edgeId = edgePath[i - 1]; // Previous edge leading to this node

      // Log animation triggers
      console.log(`🎯 Node animation: ${nodeId}`, {
        step: i + 1,
        total: nodePath.length,
        nodeType: nodes.find(n => n.id === nodeId)?.type
      });

      // Update execution state
      const newState: ExecutionState = {
        activeNodes: [nodeId],
        completedNodes: nodePath.slice(0, i),
        currentNode: nodeId,
        activeEdges: edgeId ? [edgeId] : [],
        completedEdges: edgePath.slice(0, i - 1),
      };

      setExecutionState(newState);
      onExecutionStateChange(newState);

      // Wait for animation duration
      await new Promise(resolve => setTimeout(resolve, baseDelay));

      // Mark edge as completed if exists
      if (edgeId) {
        console.log(`✅ Edge completed: ${edgeId}`);
        setExecutionState(prev => ({
          ...prev,
          activeEdges: [],
          completedEdges: [...prev.completedEdges, edgeId],
        }));
      }
    }

    // Complete execution
    const finalState: ExecutionState = {
      activeNodes: [],
      completedNodes: nodePath,
      activeEdges: [],
      completedEdges: edgePath,
    };

    setExecutionState(finalState);
    onExecutionStateChange(finalState);

    console.log('🎉 Hybrid execution animation completed');

    // Call completion callback
    onExecutionComplete({
      status: 'completed',
      inputData,
      executionPath: { nodes: nodePath, edges: edgePath },
      duration: nodePath.length * baseDelay,
    });
  }, [isExecuting, findExecutionPath, speed, onExecutionComplete, onExecutionStateChange, inputData, nodes]);

  // Start execution when isExecuting becomes true
  useEffect(() => {
    if (isExecuting) {
      executeAnimation();
    } else {
      // Reset state when execution stops
      setExecutionState({
        activeNodes: [],
        completedNodes: [],
        activeEdges: [],
        completedEdges: [],
      });
    }
  }, [isExecuting, executeAnimation]);

  // Log state changes for debugging
  useEffect(() => {
    if (executionState.currentNode) {
      console.log('🔄 Execution state updated:', {
        currentNode: executionState.currentNode,
        activeNodes: executionState.activeNodes.length,
        completedNodes: executionState.completedNodes.length,
        activeEdges: executionState.activeEdges.length,
      });
    }
  }, [executionState]);

  return null; // This component only manages state, no UI
};