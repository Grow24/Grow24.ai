import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Viewport } from '@xyflow/react';

interface ExecutionState {
  activeNodes: string[];
  completedNodes: string[];
  currentNode?: string;
}

interface FramerLayerProps {
  nodes: Node[];
  executionState: ExecutionState;
  viewport?: Viewport;
  cinematicMode?: boolean;
}

export const FramerLayer: React.FC<FramerLayerProps> = ({
  nodes,
  executionState,
  viewport = { x: 0, y: 0, zoom: 1 },
  cinematicMode = false
}) => {
  const [cameraTarget, setCameraTarget] = useState({ x: 0, y: 0 });

  // Update camera target based on current executing node
  useEffect(() => {
    if (executionState.currentNode) {
      const currentNode = nodes.find(n => n.id === executionState.currentNode);
      if (currentNode) {
        setCameraTarget({
          x: currentNode.position.x + 75,
          y: currentNode.position.y + 40
        });
      }
    }
  }, [executionState.currentNode, nodes]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        transformOrigin: '0 0',
      }}
    >
      {/* Node glow effects */}
      <AnimatePresence>
        {nodes.map((node) => {
          const isActive = executionState.activeNodes.includes(node.id);
          const isCompleted = executionState.completedNodes.includes(node.id);
          const isCurrent = executionState.currentNode === node.id;

          if (!isActive && !isCompleted && !isCurrent) return null;

          return (
            <motion.div
              key={`glow-${node.id}`}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                width: 150,
                height: 80,
                borderRadius: 8,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isCurrent ? [0.3, 0.8, 0.3] : isActive ? 0.6 : 0.3,
                scale: isCurrent ? [1, 1.1, 1] : isActive ? 1.05 : 1,
                boxShadow: isCurrent 
                  ? ['0 0 20px rgba(0, 255, 136, 0.5)', '0 0 40px rgba(0, 255, 136, 0.8)', '0 0 20px rgba(0, 255, 136, 0.5)']
                  : isActive 
                    ? '0 0 30px rgba(59, 130, 246, 0.6)'
                    : '0 0 15px rgba(16, 185, 129, 0.4)',
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: isCurrent ? 1.5 : 0.8,
                repeat: isCurrent ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Node scale animations */}
      <AnimatePresence>
        {nodes.map((node) => {
          const isCurrent = executionState.currentNode === node.id;
          
          if (!isCurrent) return null;

          return (
            <motion.div
              key={`scale-${node.id}`}
              style={{
                position: 'absolute',
                left: node.position.x + 75,
                top: node.position.y + 40,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#00ff88',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 3, 0],
                opacity: [1, 0.5, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Cinematic camera follow */}
      {cinematicMode && executionState.currentNode && (
        <motion.div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          animate={{
            x: (cameraTarget.x * viewport.zoom + viewport.x) - window.innerWidth / 2,
            y: (cameraTarget.y * viewport.zoom + viewport.y) - window.innerHeight / 2,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Background dimming for cinematic mode */}
      {cinematicMode && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Execution progress indicator */}
      {executionState.activeNodes.length > 0 && (
        <motion.div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#00ff88',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 50,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Executing: {executionState.completedNodes.length}/{nodes.length} nodes
        </motion.div>
      )}
    </div>
  );
};