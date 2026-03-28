import React, { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface HybridAnimationTestProps {
  onLoadTestFlow: (nodes: Node[], edges: Edge[]) => void;
  onStartExecution: () => void;
}

export const HybridAnimationTest: React.FC<HybridAnimationTestProps> = ({
  onLoadTestFlow,
  onStartExecution
}) => {
  const [testScenario, setTestScenario] = useState<string>('');

  // Create test flow for animation validation
  const createTestFlow = useCallback(() => {
    const testNodes: Node[] = [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Start Process',
          style: {
            fillColor: '#10b981',
            borderColor: '#059669',
            textColor: '#ffffff',
            fontSize: 14,
          }
        }
      },
      {
        id: 'decision-1',
        type: 'decision',
        position: { x: 300, y: 100 },
        data: {
          label: 'Check Condition',
          conditions: [{ condition: 'value > 10', label: 'Yes' }],
          defaultPath: 'No',
          style: {
            fillColor: '#f59e0b',
            borderColor: '#d97706',
            textColor: '#ffffff',
            fontSize: 14,
          }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 500, y: 50 },
        data: {
          label: 'Process Data',
          actionType: 'api',
          style: {
            fillColor: '#3b82f6',
            borderColor: '#2563eb',
            textColor: '#ffffff',
            fontSize: 14,
          }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 500, y: 150 },
        data: {
          label: 'Handle Error',
          actionType: 'email',
          style: {
            fillColor: '#ef4444',
            borderColor: '#dc2626',
            textColor: '#ffffff',
            fontSize: 14,
          }
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 700, y: 100 },
        data: {
          label: 'Complete',
          style: {
            fillColor: '#6b7280',
            borderColor: '#4b5563',
            textColor: '#ffffff',
            fontSize: 14,
          }
        }
      }
    ];

    const testEdges: Edge[] = [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'decision-1',
        type: 'progressive',
        label: 'Initialize',
        style: { strokeColor: '#64748b', strokeWidth: 2 }
      },
      {
        id: 'edge-2',
        source: 'decision-1',
        target: 'action-1',
        type: 'progressive',
        label: 'Yes',
        style: { strokeColor: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'edge-3',
        source: 'decision-1',
        target: 'action-2',
        type: 'progressive',
        label: 'No',
        style: { strokeColor: '#ef4444', strokeWidth: 2 }
      },
      {
        id: 'edge-4',
        source: 'action-1',
        target: 'end-1',
        type: 'progressive',
        label: 'Success',
        style: { strokeColor: '#64748b', strokeWidth: 2 }
      },
      {
        id: 'edge-5',
        source: 'action-2',
        target: 'end-1',
        type: 'progressive',
        label: 'Complete',
        style: { strokeColor: '#64748b', strokeWidth: 2 }
      }
    ];

    onLoadTestFlow(testNodes, testEdges);
    setTestScenario('basic-flow');
    toast.success('Test flow loaded - ready for hybrid animation!');
  }, [onLoadTestFlow]);

  // Create performance stress test
  const createStressTest = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Create a complex flow with many nodes
    for (let i = 0; i < 50; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;
      
      nodes.push({
        id: `node-${i}`,
        type: i === 0 ? 'start' : i === 49 ? 'end' : ['decision', 'action', 'process'][i % 3],
        position: { x: col * 200 + 100, y: row * 150 + 100 },
        data: {
          label: `Node ${i + 1}`,
          style: {
            fillColor: i === 0 ? '#10b981' : i === 49 ? '#6b7280' : '#3b82f6',
            borderColor: '#64748b',
            textColor: '#ffffff',
            fontSize: 12,
          }
        }
      });
      
      if (i > 0) {
        edges.push({
          id: `edge-${i}`,
          source: `node-${i - 1}`,
          target: `node-${i}`,
          type: 'progressive',
          style: { strokeColor: '#64748b', strokeWidth: 2 }
        });
      }
    }

    onLoadTestFlow(nodes, edges);
    setTestScenario('stress-test');
    toast.success('Stress test flow loaded - 50 nodes for performance validation!');
  }, [onLoadTestFlow]);

  return (
    <div className="fixed top-20 left-4 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50 w-64">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">🎬 Hybrid Animation Test</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-medium text-slate-700 mb-2">Test Scenarios</h4>
          <div className="space-y-2">
            <Button
              onClick={createTestFlow}
              size="sm"
              className="w-full text-xs"
              variant={testScenario === 'basic-flow' ? 'default' : 'outline'}
            >
              Basic Flow (5 nodes)
            </Button>
            <Button
              onClick={createStressTest}
              size="sm"
              className="w-full text-xs"
              variant={testScenario === 'stress-test' ? 'default' : 'outline'}
            >
              Stress Test (50 nodes)
            </Button>
          </div>
        </div>

        {testScenario && (
          <div>
            <h4 className="text-xs font-medium text-slate-700 mb-2">Animation Controls</h4>
            <Button
              onClick={onStartExecution}
              size="sm"
              className="w-full text-xs bg-green-600 hover:bg-green-700"
            >
              ▶️ Start Hybrid Animation
            </Button>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200">
          <h4 className="text-xs font-medium text-slate-700 mb-2">Expected Results</h4>
          <div className="text-xs text-slate-600 space-y-1">
            <div>✅ Node glow effects (Framer)</div>
            <div>✅ Edge particles (Pixi.js)</div>
            <div>✅ Smooth camera follow</div>
            <div>✅ GPU acceleration</div>
            <div>✅ 55+ FPS performance</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Current scenario: <span className="font-medium">{testScenario || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};