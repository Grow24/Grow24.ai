import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';

interface CinematicCameraProps {
  activeNodeId: string | null;
  activeEdgeId: string | null;
  isExecuting: boolean;
  cinematicMode: boolean;
  executedPath: string[];
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  activeNodeId,
  activeEdgeId,
  isExecuting,
  cinematicMode,
  executedPath
}) => {
  const { fitView, setCenter, getNodes, getEdges, getViewport } = useReactFlow();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastNodeRef = useRef<string | null>(null);

  // Camera follow active node
  useEffect(() => {
    if (!activeNodeId || !isExecuting) return;

    const nodes = getNodes();
    const activeNode = nodes.find(n => n.id === activeNodeId);
    if (!activeNode) return;

    setIsTransitioning(true);

    // Check if this is a decision node to handle branching
    const isDecisionNode = activeNode.type === 'decision';
    
    if (isDecisionNode) {
      // Zoom out to show all branches from decision node
      const edges = getEdges();
      const outgoingEdges = edges.filter(e => e.source === activeNodeId);
      const targetNodes = outgoingEdges.map(e => 
        nodes.find(n => n.id === e.target)
      ).filter(Boolean);

      if (targetNodes.length > 0) {
        const allNodes = [activeNode, ...targetNodes];
        fitView({
          nodes: allNodes,
          duration: 900,
          padding: 0.3,
          maxZoom: 1.2
        });
      }
    } else {
      // Focus on single node with smooth pan
      const { x, y } = activeNode.position;
      const nodeWidth = activeNode.width || 150;
      const nodeHeight = activeNode.height || 40;
      
      setCenter(
        x + nodeWidth / 2, 
        y + nodeHeight / 2, 
        { 
          zoom: 1.5, 
          duration: 900 
        }
      );
    }

    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    lastNodeRef.current = activeNodeId;
  }, [activeNodeId, isExecuting, fitView, setCenter, getNodes, getEdges]);

  // Final closure animation - show entire executed path
  useEffect(() => {
    if (!isExecuting && executedPath.length > 0 && lastNodeRef.current) {
      const nodes = getNodes();
      const pathNodes = nodes.filter(n => executedPath.includes(n.id));
      
      if (pathNodes.length > 0) {
        setTimeout(() => {
          fitView({
            nodes: pathNodes,
            duration: 1200,
            padding: 0.2,
            maxZoom: 1.0
          });
        }, 500);
      }
    }
  }, [isExecuting, executedPath, fitView, getNodes]);

  // Cinematic drift effect
  useEffect(() => {
    if (!cinematicMode || !isExecuting) return;

    const interval = setInterval(() => {
      const viewport = getViewport();
      const drift = {
        x: viewport.x + (Math.random() - 0.5) * 10,
        y: viewport.y + (Math.random() - 0.5) * 10,
        zoom: viewport.zoom + (Math.random() - 0.5) * 0.05
      };

      setCenter(drift.x, drift.y, { zoom: drift.zoom, duration: 2000 });
    }, 3000);

    return () => clearInterval(interval);
  }, [cinematicMode, isExecuting, setCenter, getViewport]);

  return (
    <>





    </>
  );
};