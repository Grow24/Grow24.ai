import React, { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';
import { Node, Edge } from '@xyflow/react';

interface PixiRendererProps {
  nodes: Node[];
  edges: Edge[];
  viewport?: { x: number; y: number; zoom: number };
  animationState?: Record<string, 'active' | 'completed' | 'error' | 'idle'>;
}

export const PixiRenderer: React.FC<PixiRendererProps> = ({
  nodes,
  edges,
  viewport = { x: 0, y: 0, zoom: 1 },
  animationState = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const nodeGraphicsRef = useRef<Map<string, Graphics>>(new Map());
  const edgeGraphicsRef = useRef<Map<string, Graphics>>(new Map());

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf8fafc,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    appRef.current = app;

    const handleResize = () => {
      if (app && !app.destroyed) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (app && !app.destroyed) {
        try {
          app.destroy(true);
        } catch (error) {
          console.warn('PixiJS destroy error:', error);
        }
      }
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!appRef.current || appRef.current.destroyed) return;

    const app = appRef.current;
    const nodeGraphics = nodeGraphicsRef.current;

    nodeGraphics.forEach(graphic => app.stage.removeChild(graphic));
    nodeGraphics.clear();

    nodes.forEach(node => {
      const graphics = new Graphics();
      const state = animationState[node.id] || 'idle';
      
      let fillColor = 0xffffff;
      let borderColor = 0x64748b;
      let glowColor = 0x000000;
      
      switch (node.type) {
        case 'start':
          fillColor = 0x10b981;
          borderColor = 0x059669;
          break;
        case 'decision':
          fillColor = 0xf59e0b;
          borderColor = 0xd97706;
          break;
        case 'action':
          fillColor = 0x3b82f6;
          borderColor = 0x2563eb;
          break;
        case 'end':
          fillColor = 0xef4444;
          borderColor = 0xdc2626;
          break;
      }

      switch (state) {
        case 'active':
          glowColor = 0x00e0ff;
          break;
        case 'completed':
          glowColor = 0x00b67a;
          break;
        case 'error':
          glowColor = 0xff6b6b;
          break;
      }

      if (state !== 'idle') {
        graphics.beginFill(glowColor, 0.3);
        graphics.drawCircle(0, 0, 35);
        graphics.endFill();
      }

      graphics.lineStyle(2, borderColor);
      graphics.beginFill(fillColor);
      graphics.drawCircle(0, 0, 25);
      graphics.endFill();

      graphics.x = node.position.x * viewport.zoom + viewport.x;
      graphics.y = node.position.y * viewport.zoom + viewport.y;
      graphics.scale.set(viewport.zoom);

      app.stage.addChild(graphics);
      nodeGraphics.set(node.id, graphics);
    });

    console.log('Pixi Render Frame:', performance.now());
  }, [nodes, viewport, animationState]);

  useEffect(() => {
    if (!appRef.current || appRef.current.destroyed) return;

    const app = appRef.current;
    const edgeGraphics = edgeGraphicsRef.current;

    edgeGraphics.forEach(graphic => app.stage.removeChild(graphic));
    edgeGraphics.clear();

    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      const graphics = new Graphics();
      
      const isAnimated = animationState[edge.source] === 'active';
      const strokeColor = isAnimated ? 0x00e0ff : 0x64748b;
      const strokeWidth = isAnimated ? 3 : 2;
      const alpha = isAnimated ? 1 : 0.7;

      graphics.lineStyle(strokeWidth, strokeColor, alpha);
      
      const startX = (sourceNode.position.x + 60) * viewport.zoom + viewport.x;
      const startY = (sourceNode.position.y + 25) * viewport.zoom + viewport.y;
      const endX = targetNode.position.x * viewport.zoom + viewport.x;
      const endY = (targetNode.position.y + 25) * viewport.zoom + viewport.y;

      graphics.moveTo(startX, startY);
      graphics.lineTo(endX, endY);

      app.stage.addChild(graphics);
      edgeGraphics.set(edge.id, graphics);
    });
  }, [edges, nodes, viewport, animationState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};