import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';
import { CinematicCamera } from './CinematicCamera';

interface ExecutionEvent {
  type: 'node-start' | 'node-end' | 'edge-taken' | 'node-error' | 'flow-complete';
  id: string;
  runId: string;
  timestamp: number;
  data?: any;
}

interface ExecutionState {
  activeNodes: Set<string>;
  completedNodes: Set<string>;
  errorNodes: Set<string>;
  activeEdges: Set<string>;
  completedEdges: Set<string>;
  runId: string | null;
  currentActiveNode: string | null;
  currentActiveEdge: string | null;
  executedPath: string[];
  executedEdges: string[];
  progressiveNodes: Set<string>;
  progressiveEdges: Set<string>;
}

interface FlowExecutionAnimatorProps {
  flowId: string;
  isExecuting: boolean;
  inputData?: any;
  cinematicMode?: boolean;
  onExecutionComplete?: (result: any) => void;
}

const COLORS = {
  active: '#00E0FF',      // Electric Blue
  completed: '#00B67A',   // Emerald
  pending: '#B0B7C3',     // Gray
  error: '#FF6B6B',       // Coral
  activeBorder: '#007BFF', // Royal Blue
  activeEdge: '#007BFF',   // Royal Blue
  completedEdge: '#A3BFFA' // Blue-Gray
};

export const FlowExecutionAnimator: React.FC<FlowExecutionAnimatorProps> = ({
  flowId,
  isExecuting,
  inputData,
  cinematicMode = false,
  onExecutionComplete
}) => {
  const { fitView, getNodes, getEdges } = useReactFlow();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState>({
    activeNodes: new Set(),
    completedNodes: new Set(),
    errorNodes: new Set(),
    activeEdges: new Set(),
    completedEdges: new Set(),
    runId: null,
    currentActiveNode: null,
    currentActiveEdge: null,
    executedPath: [],
    executedEdges: [],
    progressiveNodes: new Set(),
    progressiveEdges: new Set()
  });

  // Simulate execution animation when isExecuting changes
  useEffect(() => {
    if (!isExecuting) return;

    // Simulate flow execution with animations
    simulateFlowExecution();
  }, [isExecuting]);

  const simulateFlowExecution = async () => {
    const nodes = getNodes();
    const edges = getEdges();
    
    // Find start node
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) return;

    let currentNodeId = startNode.id;
    const visitedNodes = new Set<string>();
    const runId = `run_${Date.now()}`;

    let loopCount = 0;
    const maxLoops = 3; // Prevent infinite loops
    
    while (currentNodeId && loopCount < maxLoops) {
      // Allow revisiting nodes for loop scenarios
      if (visitedNodes.has(currentNodeId)) {
        loopCount++;
      }
      visitedNodes.add(currentNodeId);
      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (!currentNode) break;

      // Simulate node start
      handleExecutionEvent({
        type: 'node-start',
        id: currentNodeId,
        runId,
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate node end
      handleExecutionEvent({
        type: 'node-end',
        id: currentNodeId,
        runId,
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Find next node based on node type
      let nextNodeId: string | null = null;
      let selectedEdge: any = null;
      
      if (currentNode.type === 'decision') {
        // For decision nodes, simulate condition evaluation
        const conditions = currentNode.data.conditions || [];
        
        // Try to evaluate conditions with input data
        let conditionMet = false;
        if (conditions.length > 0 && inputData) {
          for (const condition of conditions) {
            try {
              // Simple condition evaluation
              const result = evaluateCondition(condition.condition, inputData);
              if (result) {
                selectedEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === condition.id);
                conditionMet = true;
                break;
              }
            } catch (error) {
              // Continue to next condition
            }
          }
        }
        
        // If no condition met, use random or default
        if (!conditionMet) {
          if (conditions.length > 0) {
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            selectedEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === randomCondition.id);
          }
        }
        
        // Fallback to default path
        if (!selectedEdge) {
          selectedEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === 'default');
        }
        
        // Final fallback to any outgoing edge
        if (!selectedEdge) {
          selectedEdge = edges.find(e => e.source === currentNodeId);
        }
      } else {
        // For other nodes, just find the first outgoing edge
        selectedEdge = edges.find(e => e.source === currentNodeId);
      }
      
      // Helper function to evaluate simple conditions
      function evaluateCondition(condition: string, data: any): boolean {
        try {
          // Replace variable names with data values
          let evalCondition = condition;
          Object.keys(data).forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            evalCondition = evalCondition.replace(regex, JSON.stringify(data[key]));
          });
          
          // Simple evaluation (extend as needed)
          return Function(`"use strict"; return (${evalCondition})`)();
        } catch {
          return false;
        }
      }
      
      if (selectedEdge) {
        // Simulate edge animation
        handleExecutionEvent({
          type: 'edge-taken',
          id: selectedEdge.id,
          runId,
          timestamp: Date.now()
        });

        await new Promise(resolve => setTimeout(resolve, 800));
        nextNodeId = selectedEdge.target;
      }

      currentNodeId = nextNodeId;
    }

    // Complete execution
    handleExecutionEvent({
      type: 'flow-complete',
      id: 'flow',
      runId,
      timestamp: Date.now()
    });
    
    // Pass input data to completion handler
    onExecutionComplete?.({ inputData, runId, completedAt: Date.now() });
  };

  const handleExecutionEvent = useCallback((event: ExecutionEvent) => {
    setExecutionState(prev => {
      const newState = { ...prev };

      switch (event.type) {
        case 'node-start':
          newState.activeNodes = new Set([...prev.activeNodes, event.id]);
          newState.runId = event.runId;
          newState.currentActiveNode = event.id;
          newState.executedPath = [...prev.executedPath, event.id];
          break;

        case 'node-end':
          newState.activeNodes = new Set([...prev.activeNodes]);
          newState.activeNodes.delete(event.id);
          newState.currentActiveNode = null;
          newState.progressiveNodes = new Set([...prev.progressiveNodes, event.id]);
          
          if (event.data?.success) {
            newState.completedNodes = new Set([...prev.completedNodes, event.id]);
          }
          break;

        case 'edge-taken':
          newState.activeEdges = new Set([...prev.activeEdges, event.id]);
          newState.currentActiveEdge = event.id;
          newState.executedEdges = [...prev.executedEdges, event.id];
          
          // Remove edge from active after animation and add to progressive
          setTimeout(() => {
            setExecutionState(current => ({
              ...current,
              activeEdges: new Set([...current.activeEdges].filter(id => id !== event.id)),
              currentActiveEdge: current.currentActiveEdge === event.id ? null : current.currentActiveEdge,
              progressiveEdges: new Set([...current.progressiveEdges, event.id])
            }));
          }, 600);
          break;

        case 'node-error':
          newState.activeNodes = new Set([...prev.activeNodes]);
          newState.activeNodes.delete(event.id);
          newState.errorNodes = new Set([...prev.errorNodes, event.id]);
          break;

        case 'flow-complete':
          newState.activeNodes = new Set();
          newState.activeEdges = new Set();
          newState.currentActiveNode = null;
          newState.currentActiveEdge = null;
          
          // Keep executed path bright for 2 seconds before fading
          setTimeout(() => {
            setExecutionState(current => ({
              ...current,
              completedNodes: new Set(),
              executedPath: [],
              progressiveNodes: new Set(),
              progressiveEdges: new Set()
            }));
          }, 2000);
          
          onExecutionComplete?.(event.data);
          break;
      }

      return newState;
    });
  }, [getNodes, fitView, onExecutionComplete]);

  // Reset state when execution stops
  useEffect(() => {
    if (!isExecuting) {
      setExecutionState({
        activeNodes: new Set(),
        completedNodes: new Set(),
        errorNodes: new Set(),
        activeEdges: new Set(),
        completedEdges: new Set(),
        runId: null,
        currentActiveNode: null,
        currentActiveEdge: null,
        executedPath: [],
        executedEdges: [],
        progressiveNodes: new Set(),
        progressiveEdges: new Set()
      });
    }
  }, [isExecuting]);

  return (
    <>
      {/* Cinematic Camera System */}
      <CinematicCamera
        activeNodeId={executionState.currentActiveNode}
        activeEdgeId={executionState.currentActiveEdge}
        isExecuting={isExecuting}
        cinematicMode={cinematicMode}
        executedPath={executionState.executedPath}
      />
      
      {/* Node Overlays */}
      <AnimatePresence>
        {getNodes().map(node => {
          const isActive = executionState.activeNodes.has(node.id);
          const isCompleted = executionState.completedNodes.has(node.id);
          const hasError = executionState.errorNodes.has(node.id);
          const isProgressive = executionState.progressiveNodes.has(node.id);
          
          if (!isActive && !isCompleted && !hasError && !isProgressive) return null;

          let color = COLORS.pending;
          if (isActive) color = COLORS.active;
          else if (isCompleted) color = COLORS.completed;
          else if (hasError) color = COLORS.error;
          else if (isProgressive) color = COLORS.activeBorder;

          return (
            <motion.div
              key={`overlay-${node.id}`}
              className="absolute pointer-events-none"
              style={{
                left: node.position.x - 10,
                top: node.position.y - 10,
                width: (node.width || 150) + 20,
                height: (node.height || 40) + 20,
                zIndex: 1000
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: isActive ? 1.08 : 1,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Sharp Background Gradient */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, #E0F2FE 0%, #1E40AF 100%)`
                    : isCompleted 
                    ? `linear-gradient(135deg, #ECFDF5 0%, #059669 100%)`
                    : isProgressive
                    ? `linear-gradient(135deg, #DBEAFE 0%, #3B82F6 100%)`
                    : 'transparent',
                  borderRadius: isProgressive ? '16px' : '12px'
                }}
                animate={{
                  opacity: 0
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Sharp Border Highlight */}
              <motion.div
                className="absolute inset-2 border-3"
                style={{ 
                  borderColor: isActive ? COLORS.activeBorder : isProgressive ? COLORS.activeBorder : color,
                  borderWidth: isActive ? '3px' : isProgressive ? '2px' : '2px',
                  borderRadius: isProgressive ? '12px' : '8px'
                }}
                animate={{
                  scale: isActive ? 1.08 : 1,
                  opacity: 0
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Edge Animations */}
      <AnimatePresence>
        {getEdges().map(edge => {
          const isActive = executionState.activeEdges.has(edge.id);
          if (!isActive) return null;

          return (
            <EdgeParticle
              key={`particle-${edge.id}`}
              edge={edge}
              color={COLORS.active}
            />
          );
        })}
      </AnimatePresence>
      
      {/* Progressive Edge Highlighting */}
      <style>{`
        .react-flow__edge[data-id="${Array.from(executionState.progressiveEdges).join('"], .react-flow__edge[data-id="')}"] path {
          stroke: ${COLORS.activeBorder} !important;
          stroke-width: 3px !important;
          transition: all 0.3s ease !important;
        }
      `}</style>


    </>
  );
};

// Edge Particle Component
interface EdgeParticleProps {
  edge: any;
  color: string;
}

const EdgeParticle: React.FC<EdgeParticleProps> = ({ edge, color }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ zIndex: 1001 }}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <svg
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <defs>
          <linearGradient id={`gradient-${edge.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        <motion.circle
          r="4"
          fill={color}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`
          }}
          animate={{
            offsetDistance: ['0%', '100%']
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
};