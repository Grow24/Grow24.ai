import { useState, useCallback, useRef } from 'react';
import { Viewport } from '@xyflow/react';

interface ViewportSyncState {
  viewport: Viewport;
  updateViewport: (viewport: Viewport) => void;
  broadcastViewportChange: (viewport: Viewport) => void;
}

export const useViewportSync = (): ViewportSyncState => {
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const lastBroadcastRef = useRef<number>(0);

  const updateViewport = useCallback((newViewport: Viewport) => {
    setViewport(newViewport);
    
    // Log viewport changes for debugging
    console.log('Viewport updated:', {
      x: Math.round(newViewport.x),
      y: Math.round(newViewport.y),
      zoom: Math.round(newViewport.zoom * 100) / 100,
    });
  }, []);

  const broadcastViewportChange = useCallback((newViewport: Viewport) => {
    const now = performance.now();
    
    // Throttle broadcasts to avoid performance issues
    if (now - lastBroadcastRef.current < 16) return; // ~60fps
    
    lastBroadcastRef.current = now;
    updateViewport(newViewport);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('viewport-change', {
      detail: newViewport
    }));
  }, [updateViewport]);

  return {
    viewport,
    updateViewport,
    broadcastViewportChange,
  };
};