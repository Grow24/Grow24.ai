import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Node, Edge } from '@xyflow/react';

interface HybridTestPanelProps {
  onLoadTestFlow: (nodes: Node[], edges: Edge[]) => void;
  onStartExecution: () => void;
}

export const HybridTestPanel: React.FC<HybridTestPanelProps> = ({
  onLoadTestFlow,
  onStartExecution
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const generateTestFlow = (nodeCount: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Generate nodes in a grid pattern
    const cols = Math.ceil(Math.sqrt(nodeCount));
    const rows = Math.ceil(nodeCount / cols);

    for (let i = 0; i < nodeCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const nodeType = i === 0 ? 'start' : 
                      i === nodeCount - 1 ? 'end' :
                      i % 3 === 1 ? 'decision' : 'action';

      nodes.push({
        id: `node-${i}`,
        type: nodeType,
        position: { 
          x: col * 200 + 100, 
          y: row * 150 + 100 
        },
        data: { 
          label: `${nodeType} ${i + 1}`,
          conditions: nodeType === 'decision' ? [
            { id: 'yes', label: 'Yes', expression: 'true' },
            { id: 'no', label: 'No', expression: 'false' }
          ] : undefined,
          defaultPath: nodeType === 'decision' ? 'no' : undefined
        }
      });

      // Connect to next node
      if (i < nodeCount - 1) {
        edges.push({
          id: `edge-${i}`,
          source: `node-${i}`,
          target: `node-${i + 1}`,
          type: 'progressive'
        });
      }
    }

    return { nodes, edges };
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
        size="sm"
      >
        🎬 Hybrid Test
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Hybrid Rendering Test</h3>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
        >
          ×
        </Button>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          Test GPU rendering performance with different node counts:
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              const { nodes, edges } = generateTestFlow(10);
              onLoadTestFlow(nodes, edges);
            }}
            variant="outline"
            size="sm"
          >
            10 Nodes
          </Button>
          <Button
            onClick={() => {
              const { nodes, edges } = generateTestFlow(50);
              onLoadTestFlow(nodes, edges);
            }}
            variant="outline"
            size="sm"
          >
            50 Nodes
          </Button>
          <Button
            onClick={() => {
              const { nodes, edges } = generateTestFlow(100);
              onLoadTestFlow(nodes, edges);
            }}
            variant="outline"
            size="sm"
          >
            100 Nodes
          </Button>
          <Button
            onClick={() => {
              const { nodes, edges } = generateTestFlow(500);
              onLoadTestFlow(nodes, edges);
            }}
            variant="outline"
            size="sm"
          >
            500 Nodes
          </Button>
        </div>

        <Button
          onClick={onStartExecution}
          className="w-full"
        >
          🎬 Start Animation Test
        </Button>

        <div className="text-xs text-slate-500 space-y-1">
          <div>• GPU rendering via Pixi.js</div>
          <div>• Framer Motion animations</div>
          <div>• Performance monitoring</div>
        </div>
      </div>
    </div>
  );
};