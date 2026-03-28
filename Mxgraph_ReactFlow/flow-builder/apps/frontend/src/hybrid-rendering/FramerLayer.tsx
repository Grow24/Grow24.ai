import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Edge, useReactFlow } from '@xyflow/react';

interface FramerLayerProps {
  nodes: Node[];
  edges: Edge[];
  animationState?: Record<string, 'active' | 'completed' | 'error' | 'idle'>;
}

export const FramerLayer: React.FC<FramerLayerProps> = ({
  nodes,
  edges,
  animationState = {}
}) => {
  const { fitView, setCenter } = useReactFlow();

  // Camera following logic for active nodes
  useEffect(() => {
    const activeNodeId = Object.keys(animationState).find(
      nodeId => animationState[nodeId] === 'active'
    );

    if (activeNodeId) {
      const activeNode = nodes.find(n => n.id === activeNodeId);
      if (activeNode) {
        console.log('Node Execution Event:', activeNodeId);
        
        // Smooth camera follow
        setCenter(activeNode.position.x + 60, activeNode.position.y + 30, {
          duration: 900,
          zoom: 1.2
        });
      }
    }
  }, [animationState, nodes, setCenter]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3
      }}
    >
      <AnimatePresence>
        {nodes.map(node => {
          const state = animationState[node.id];
          if (state === 'idle') return null;

          return (
            <motion.div
              key={`${node.id}-animation`}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: state === 'active' ? 1.08 : 1,
                opacity: state === 'active' ? 1 : 0.9
              }}
              exit={{ scale: 1, opacity: 0.8 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                repeat: state === 'active' ? Infinity : 0,
                repeatType: 'reverse'
              }}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                width: 120,
                height: 50,
                borderRadius: '8px',
                background: state === 'active' 
                  ? 'radial-gradient(circle, rgba(0,224,255,0.3) 0%, transparent 70%)'
                  : state === 'completed'
                  ? 'radial-gradient(circle, rgba(0,182,122,0.3) 0%, transparent 70%)'
                  : state === 'error'
                  ? 'radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)'
                  : 'transparent',
                pointerEvents: 'none'
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Edge animations */}
      <AnimatePresence>
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          const isAnimated = animationState[edge.source] === 'active';

          if (!sourceNode || !targetNode || !isAnimated) return null;

          const startX = sourceNode.position.x + 60;
          const startY = sourceNode.position.y + 25;
          const endX = targetNode.position.x;
          const endY = targetNode.position.y + 25;

          const length = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
          );
          const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

          return (
            <motion.div
              key={`${edge.id}-flow`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                left: startX,
                top: startY,
                width: length,
                height: 3,
                background: 'linear-gradient(90deg, #00e0ff, transparent)',
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg)`,
                pointerEvents: 'none'
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};