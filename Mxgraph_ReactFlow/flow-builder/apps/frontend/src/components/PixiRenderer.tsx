import React, { useEffect, useRef, useCallback } from 'react';
import { Node, Edge, Viewport } from '@xyflow/react';

// Fallback Canvas 2D implementation when Pixi.js is not available
let PIXI: any = null;
try {
  PIXI = require('pixi.js');
} catch (e) {
  console.warn('Pixi.js not available, using Canvas 2D fallback');
}

interface PixiRendererProps {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
  isExecuting?: boolean;
  executionPath?: string[];
}

export const PixiRenderer: React.FC<PixiRendererProps> = ({
  nodes,
  edges,
  viewport = { x: 0, y: 0, zoom: 1 },
  isExecuting = false,
  executionPath = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const edgeGraphicsRef = useRef<PIXI.Graphics | null>(null);
  const particleContainerRef = useRef<PIXI.Container | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Canvas 2D fallback renderer
  const renderWithCanvas2D = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply viewport transform
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.zoom, viewport.zoom);
    
    // Render edges
    edges.forEach((edge) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      const isActive = executionPath.includes(edge.id);
      
      ctx.strokeStyle = isActive ? '#00ff88' : '#64748b';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.globalAlpha = isActive ? 1 : 0.6;
      
      ctx.beginPath();
      ctx.moveTo(sourceNode.position.x + 75, sourceNode.position.y + 40);
      ctx.lineTo(targetNode.position.x + 75, targetNode.position.y + 40);
      ctx.stroke();
      
      // Add glow effect for active edges
      if (isActive) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 8;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(sourceNode.position.x + 75, sourceNode.position.y + 40);
        ctx.lineTo(targetNode.position.x + 75, targetNode.position.y + 40);
        ctx.stroke();
      }
    });
    
    // Render particles for active edges
    if (isExecuting) {
      executionPath.forEach(edgeId => {
        const edge = edges.find(e => e.id === edgeId);
        if (!edge) return;

        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return;

        // Simple particle animation
        const time = Date.now() * 0.002;
        const progress = (Math.sin(time) + 1) * 0.5;
        
        const x = sourceNode.position.x + 75 + (targetNode.position.x + 75 - sourceNode.position.x - 75) * progress;
        const y = sourceNode.position.y + 40 + (targetNode.position.y + 40 - sourceNode.position.y - 40) * progress;
        
        ctx.fillStyle = '#00ff88';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    ctx.restore();
  }, [nodes, edges, viewport, isExecuting, executionPath]);

  // Initialize Pixi application or fallback to Canvas 2D
  useEffect(() => {
    if (!canvasRef.current) return;

    if (!PIXI) {
      // Use Canvas 2D fallback
      const animate = () => {
        renderWithCanvas2D();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
      
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    appRef.current = app;

    // Create containers
    const edgeGraphics = new PIXI.Graphics();
    const particleContainer = new PIXI.Container();
    
    app.stage.addChild(edgeGraphics);
    app.stage.addChild(particleContainer);
    
    edgeGraphicsRef.current = edgeGraphics;
    particleContainerRef.current = particleContainer;

    // Handle resize
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      app.destroy(true);
    };
  }, [renderWithCanvas2D]);

  // Update viewport transform
  useEffect(() => {
    if (!appRef.current) return;
    
    const stage = appRef.current.stage;
    stage.position.set(viewport.x, viewport.y);
    stage.scale.set(viewport.zoom);
  }, [viewport]);

  // Render edges with GPU acceleration
  const renderEdges = useCallback(() => {
    if (!edgeGraphicsRef.current) return;

    const graphics = edgeGraphicsRef.current;
    graphics.clear();

    edges.forEach((edge) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      const isActive = executionPath.includes(edge.id);
      const color = isActive ? 0x00ff88 : 0x64748b;
      const width = isActive ? 4 : 2;
      const alpha = isActive ? 1 : 0.6;

      graphics.lineStyle(width, color, alpha);
      
      // Simple straight line for performance
      graphics.moveTo(sourceNode.position.x + 75, sourceNode.position.y + 40);
      graphics.lineTo(targetNode.position.x + 75, targetNode.position.y + 40);

      // Add glow effect for active edges
      if (isActive) {
        graphics.lineStyle(8, color, 0.3);
        graphics.moveTo(sourceNode.position.x + 75, sourceNode.position.y + 40);
        graphics.lineTo(targetNode.position.x + 75, targetNode.position.y + 40);
      }
    });
  }, [edges, nodes, executionPath]);

  // Create particle effects for active edges
  const createParticles = useCallback(() => {
    if (!particleContainerRef.current || !isExecuting) return;

    const container = particleContainerRef.current;
    
    // Clear existing particles
    container.removeChildren();

    executionPath.forEach(edgeId => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      // Create particle
      const particle = new PIXI.Graphics();
      particle.beginFill(0x00ff88);
      particle.drawCircle(0, 0, 3);
      particle.endFill();

      particle.position.set(sourceNode.position.x + 75, sourceNode.position.y + 40);
      container.addChild(particle);

      // Animate particle along edge
      const startX = sourceNode.position.x + 75;
      const startY = sourceNode.position.y + 40;
      const endX = targetNode.position.x + 75;
      const endY = targetNode.position.y + 40;

      let progress = 0;
      const animate = () => {
        progress += 0.02;
        if (progress > 1) {
          container.removeChild(particle);
          return;
        }

        particle.position.set(
          startX + (endX - startX) * progress,
          startY + (endY - startY) * progress
        );

        requestAnimationFrame(animate);
      };
      animate();
    });
  }, [edges, nodes, executionPath, isExecuting]);

  // Update rendering
  useEffect(() => {
    renderEdges();
    createParticles();
  }, [renderEdges, createParticles]);

  // Performance monitoring
  useEffect(() => {
    if (!appRef.current) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`Pixi.js FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
        zIndex: 1,
      }}
    />
  );
};