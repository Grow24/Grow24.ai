import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, ReactFlowProps, OnMove } from '@xyflow/react';
import { PixiRenderer } from './PixiRenderer';
import { FramerLayer } from './FramerLayer';

interface HybridFlowWrapperProps extends ReactFlowProps {
  animationState?: Record<string, 'active' | 'completed' | 'error' | 'idle'>;
}

export const HybridFlowWrapper: React.FC<HybridFlowWrapperProps> = ({
  animationState = {},
  onMove,
  ...reactFlowProps
}) => {
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const handleViewportChange: OnMove = useCallback((event, newViewport) => {
    setViewport(newViewport);
    console.log('Viewport Sync:', newViewport);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('viewport-change', {
      detail: newViewport
    }));

    // Call original onMove if provided
    if (onMove) {
      onMove(event, newViewport);
    }
  }, [onMove]);

  // Listen for animation state changes
  useEffect(() => {
    const handleNodeSelect = (event: CustomEvent) => {
      console.log('Node Select Event:', event.detail);
    };

    const handleNodeHover = (event: CustomEvent) => {
      console.log('Node Hover Event:', event.detail);
    };

    const handleEdgeAnimate = (event: CustomEvent) => {
      console.log('Edge Animate Event:', event.detail);
    };

    window.addEventListener('node-select', handleNodeSelect as EventListener);
    window.addEventListener('node-hover', handleNodeHover as EventListener);
    window.addEventListener('edge-animate', handleEdgeAnimate as EventListener);

    return () => {
      window.removeEventListener('node-select', handleNodeSelect as EventListener);
      window.removeEventListener('node-hover', handleNodeHover as EventListener);
      window.removeEventListener('edge-animate', handleEdgeAnimate as EventListener);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* GPU Rendering Layer */}
      <PixiRenderer
        nodes={reactFlowProps.nodes || []}
        edges={reactFlowProps.edges || []}
        viewport={viewport}
        animationState={animationState}
      />
      
      {/* React Flow Logic Layer */}
      <ReactFlow
        {...reactFlowProps}
        onMove={handleViewportChange}
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'transparent'
        }}
        // Make nodes transparent so Pixi renders them
        nodesDraggable={reactFlowProps.nodesDraggable !== false}
        nodesConnectable={reactFlowProps.nodesConnectable !== false}
        elementsSelectable={reactFlowProps.elementsSelectable !== false}
      />
      
      {/* Animation Layer */}
      <FramerLayer
        nodes={reactFlowProps.nodes || []}
        edges={reactFlowProps.edges || []}
        animationState={animationState}
      />
    </div>
  );
};