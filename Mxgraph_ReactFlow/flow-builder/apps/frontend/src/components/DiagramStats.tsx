import React, { useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

interface DiagramStatsProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  validationResult?: { valid: boolean; errors: string[] };
  executionMetrics?: {
    lastRun?: string;
    averageDuration?: number;
    successRate?: number;
  };
}

export const DiagramStats: React.FC<DiagramStatsProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onSelectNode,
  onSelectEdge,
  validationResult,
  executionMetrics
}) => {
  const stats = useMemo(() => {
    // Node type counts
    const nodeTypeCounts = nodes.reduce((acc, node) => {
      acc[node.type || 'unknown'] = (acc[node.type || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Decision branch counts
    const decisionBranches = nodes
      .filter(node => node.type === 'decision')
      .reduce((total, node) => {
        const conditions = node.data.conditions || [];
        return total + conditions.length + 1; // +1 for default path
      }, 0);

    // Unlabeled edges
    const unlabeledEdges = edges.filter(edge => !edge.label || edge.label.trim() === '');

    // Unreachable nodes (simplified check)
    const reachableNodes = new Set<string>();
    const startNodes = nodes.filter(node => node.type === 'start');
    
    const traverse = (nodeId: string) => {
      if (reachableNodes.has(nodeId)) return;
      reachableNodes.add(nodeId);
      
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => traverse(edge.target));
    };
    
    startNodes.forEach(node => traverse(node.id));
    const unreachableNodes = nodes.filter(node => !reachableNodes.has(node.id) && node.type !== 'start');

    // Isolated nodes (no connections)
    const connectedNodeIds = new Set([
      ...edges.map(edge => edge.source),
      ...edges.map(edge => edge.target)
    ]);
    const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));

    return {
      nodeTypeCounts,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      decisionBranches,
      unlabeledEdges,
      unreachableNodes,
      isolatedNodes
    };
  }, [nodes, edges]);

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🟢';
      case 'decision': return '🔶';
      case 'action': return '🔵';
      case 'process': return '🟣';
      case 'end': return '🔴';
      case 'connector': return '⚪';
      case 'document': return '📄';
      case 'database': return '🗄️';
      case 'inputoutput': return '📥';
      case 'annotation': return '📝';
      case 'text': return '📝';
      case 'callout': return '💬';
      case 'image': return '🖼️';
      default: return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 top-20 bottom-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-40 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Diagram Stats</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Validation Status */}
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            {validationResult?.valid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className="font-medium text-sm">
              Validation {validationResult?.valid ? 'Passed' : 'Failed'}
            </span>
          </div>
          {validationResult?.errors && validationResult.errors.length > 0 && (
            <div className="text-xs text-red-600 space-y-1">
              {validationResult.errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}
        </Card>

        {/* Overview Stats */}
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-3">Overview</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{stats.totalNodes}</div>
              <div className="text-gray-600">Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{stats.totalEdges}</div>
              <div className="text-gray-600">Edges</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{stats.decisionBranches}</div>
              <div className="text-gray-600">Branches</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {stats.unlabeledEdges.length}
              </div>
              <div className="text-gray-600">Unlabeled</div>
            </div>
          </div>
        </Card>

        {/* Node Types */}
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-3">Node Types</h4>
          <div className="space-y-2">
            {Object.entries(stats.nodeTypeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{getNodeTypeIcon(type)}</span>
                  <span className="capitalize">{type}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Issues */}
        {(stats.unlabeledEdges.length > 0 || stats.unreachableNodes.length > 0 || stats.isolatedNodes.length > 0) && (
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-3 text-red-600">Issues Found</h4>
            <div className="space-y-2">
              {stats.unlabeledEdges.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-600 mb-1">
                    Unlabeled Edges ({stats.unlabeledEdges.length})
                  </div>
                  <div className="space-y-1">
                    {stats.unlabeledEdges.slice(0, 3).map(edge => (
                      <Button
                        key={edge.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectEdge(edge.id)}
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-800 justify-start w-full"
                      >
                        {edge.source} → {edge.target}
                      </Button>
                    ))}
                    {stats.unlabeledEdges.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{stats.unlabeledEdges.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {stats.unreachableNodes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-orange-600 mb-1">
                    Unreachable Nodes ({stats.unreachableNodes.length})
                  </div>
                  <div className="space-y-1">
                    {stats.unreachableNodes.slice(0, 3).map(node => (
                      <Button
                        key={node.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectNode(node.id)}
                        className="h-6 px-2 text-xs text-orange-600 hover:text-orange-800 justify-start w-full"
                      >
                        {node.data.label || node.id}
                      </Button>
                    ))}
                    {stats.unreachableNodes.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{stats.unreachableNodes.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {stats.isolatedNodes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-yellow-600 mb-1">
                    Isolated Nodes ({stats.isolatedNodes.length})
                  </div>
                  <div className="space-y-1">
                    {stats.isolatedNodes.slice(0, 3).map(node => (
                      <Button
                        key={node.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectNode(node.id)}
                        className="h-6 px-2 text-xs text-yellow-600 hover:text-yellow-800 justify-start w-full"
                      >
                        {node.data.label || node.id}
                      </Button>
                    ))}
                    {stats.isolatedNodes.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{stats.isolatedNodes.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Execution Metrics */}
        {executionMetrics && (
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Execution Metrics</h4>
            </div>
            <div className="space-y-2 text-sm">
              {executionMetrics.lastRun && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Run:</span>
                  <span>{new Date(executionMetrics.lastRun).toLocaleString()}</span>
                </div>
              )}
              {executionMetrics.averageDuration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Duration:</span>
                  <span>{executionMetrics.averageDuration}ms</span>
                </div>
              )}
              {executionMetrics.successRate !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className={executionMetrics.successRate > 0.8 ? 'text-green-600' : 'text-red-600'}>
                    {(executionMetrics.successRate * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};