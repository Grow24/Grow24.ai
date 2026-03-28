# Hybrid Flow Rendering System

## Overview
This system combines React Flow (logic), Pixi.js (GPU rendering), and Framer Motion (animations) for high-performance flow visualization.

## Architecture
- **PixiRenderer.tsx**: GPU-based WebGL rendering of nodes and edges
- **FramerLayer.tsx**: Cinematic animations and camera controls  
- **HybridFlowWrapper.tsx**: Integration layer bridging React Flow and rendering layers
- **HybridTestPanel.tsx**: Testing interface for performance validation

## Usage

### Enable Hybrid Rendering
```javascript
// In browser console or localStorage
localStorage.setItem('ENABLE_HYBRID_RENDERING', 'true');
// Refresh page
```

### Test Performance
1. Click "⚡ GPU" button in navbar to enable hybrid rendering
2. Click "🎬 Hybrid" to open test panel
3. Load test flows with different node counts (10, 50, 100, 500)
4. Start animation test to validate performance

## Expected Performance
- **FPS**: ≥55 with 1000+ nodes
- **GPU Usage**: ≤25%
- **CPU Usage**: ≤20%
- **Memory**: No WebGL leaks

## Features
- GPU-accelerated node/edge rendering
- Smooth camera following during execution
- State-based visual effects (active, completed, error)
- Cinematic transitions and animations
- Performance monitoring and debug logs

## Fallback
System automatically falls back to standard React Flow SVG rendering when disabled.