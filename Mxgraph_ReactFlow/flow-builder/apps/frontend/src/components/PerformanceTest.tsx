import React, { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PerformanceTestProps {
  onLoadTestData: (nodes: Node[], edges: Edge[]) => void;
}

export const PerformanceTest: React.FC<PerformanceTestProps> = ({ onLoadTestData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<{
    fps: number;
    cpuUsage: number;
    nodeCount: number;
    edgeCount: number;
  } | null>(null);

  // Generate test data with specified number of nodes
  const generateTestData = useCallback((nodeCount: number) => {
    setIsGenerating(true);
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Generate nodes in a grid pattern for better performance
    const gridSize = Math.ceil(Math.sqrt(nodeCount));
    const spacing = 200;
    
    for (let i = 0; i < nodeCount; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      const nodeTypes = ['start', 'decision', 'action', 'process', 'end'];
      const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      
      nodes.push({
        id: `test-node-${i}`,
        type: nodeType,
        position: {
          x: col * spacing + Math.random() * 50,
          y: row * spacing + Math.random() * 50,
        },
        data: {
          label: `Node ${i + 1}`,
          style: {
            fillColor: nodeType === 'start' ? '#10b981' : 
                      nodeType === 'decision' ? '#f59e0b' :
                      nodeType === 'action' ? '#3b82f6' :
                      nodeType === 'process' ? '#a855f7' :
                      '#ef4444',
            borderColor: '#64748b',
            borderWidth: 2,
            textColor: '#ffffff',
            fontSize: 12,
          }
        },
      });
      
      // Create edges to connect some nodes
      if (i > 0 && Math.random() > 0.3) {
        const sourceIndex = Math.floor(Math.random() * i);
        edges.push({
          id: `test-edge-${i}`,
          source: `test-node-${sourceIndex}`,
          target: `test-node-${i}`,
          type: 'progressive',
          style: {
            strokeColor: '#64748b',
            strokeWidth: 2,
          }
        });
      }
    }
    
    setIsGenerating(false);
    onLoadTestData(nodes, edges);
    
    toast.success(`Generated ${nodeCount} nodes and ${edges.length} edges for performance testing`);
  }, [onLoadTestData]);

  // Monitor performance
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Estimate CPU usage (simplified)
        const cpuUsage = Math.max(0, Math.min(100, (60 - fps) * 2));
        
        setPerformanceStats(prev => ({
          fps,
          cpuUsage,
          nodeCount: prev?.nodeCount || 0,
          edgeCount: prev?.edgeCount || 0,
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Update node/edge count when data changes
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const { nodes, edges } = event.detail;
      setPerformanceStats(prev => ({
        ...prev,
        nodeCount: nodes?.length || 0,
        edgeCount: edges?.length || 0,
        fps: prev?.fps || 0,
        cpuUsage: prev?.cpuUsage || 0,
      }));
    };

    window.addEventListener('flow-data-updated', handleDataUpdate as EventListener);
    return () => {
      window.removeEventListener('flow-data-updated', handleDataUpdate as EventListener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Performance Test</h3>
      
      {/* Performance Stats */}
      {performanceStats && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>FPS:</span>
            <span className={performanceStats.fps >= 55 ? 'text-green-600' : performanceStats.fps >= 30 ? 'text-yellow-600' : 'text-red-600'}>
              {performanceStats.fps}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>CPU:</span>
            <span className={performanceStats.cpuUsage <= 25 ? 'text-green-600' : performanceStats.cpuUsage <= 50 ? 'text-yellow-600' : 'text-red-600'}>
              {performanceStats.cpuUsage}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Nodes:</span>
            <span>{performanceStats.nodeCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Edges:</span>
            <span>{performanceStats.edgeCount}</span>
          </div>
        </div>
      )}
      
      {/* Test Buttons */}
      <div className="space-y-2">
        <Button
          onClick={() => generateTestData(100)}
          disabled={isGenerating}
          size="sm"
          className="w-full text-xs"
        >
          100 Nodes
        </Button>
        <Button
          onClick={() => generateTestData(500)}
          disabled={isGenerating}
          size="sm"
          className="w-full text-xs"
        >
          500 Nodes
        </Button>
        <Button
          onClick={() => generateTestData(1000)}
          disabled={isGenerating}
          size="sm"
          className="w-full text-xs"
        >
          1000 Nodes
        </Button>
        <Button
          onClick={() => generateTestData(2000)}
          disabled={isGenerating}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          2000 Nodes (Stress)
        </Button>
      </div>
      
      {/* Performance Indicators */}
      <div className="mt-3 pt-3 border-t border-slate-200">
        <div className="text-xs text-slate-600">
          Target: ≥55 FPS, &lt;25% CPU
        </div>
        {performanceStats && (
          <div className={`text-xs mt-1 ${
            performanceStats.fps >= 55 && performanceStats.cpuUsage <= 25 
              ? 'text-green-600' 
              : 'text-yellow-600'
          }`}>
            {performanceStats.fps >= 55 && performanceStats.cpuUsage <= 25 
              ? '✅ Performance OK' 
              : '⚠️ Performance Warning'
            }
          </div>
        )}
      </div>
    </div>
  );
};