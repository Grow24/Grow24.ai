import { Node, Edge } from '@xyflow/react';

export interface EdgeSplitResult {
  newNode: Node;
  newEdges: Edge[];
  removedEdgeId: string;
}

export function splitEdgeWithNode(
  edge: Edge,
  newNodeType: string,
  nodes: Node[],
  edges: Edge[]
): EdgeSplitResult {
  // Calculate position on edge path (center point)
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);
  
  if (!sourceNode || !targetNode) {
    throw new Error('Source or target node not found');
  }

  const centerX = (sourceNode.position.x + targetNode.position.x) / 2;
  const centerY = (sourceNode.position.y + targetNode.position.y) / 2;

  // Create new node
  const newNodeId = `${newNodeType}-${Date.now()}`;
  const newNode: Node = {
    id: newNodeId,
    type: newNodeType,
    position: { x: centerX, y: centerY },
    data: {
      label: `New ${newNodeType}`,
      shapeType: newNodeType,
      style: getDefaultStyleForType(newNodeType)
    }
  };

  // Create new edges
  const firstEdge: Edge = {
    ...edge,
    id: `${edge.source}-${newNodeId}`,
    target: newNodeId,
    data: edge.data
  };

  const secondEdge: Edge = {
    ...edge,
    id: `${newNodeId}-${edge.target}`,
    source: newNodeId,
    label: edge.label, // Preserve original label on second edge
    data: edge.data
  };

  return {
    newNode,
    newEdges: [firstEdge, secondEdge],
    removedEdgeId: edge.id
  };
}

function getDefaultStyleForType(nodeType: string) {
  const baseStyle = {
    fillColor: '#ffffff',
    borderColor: '#64748b',
    borderWidth: 2,
    borderStyle: 'solid',
    textColor: '#ffffff',
    fontSize: 14,
    icon: 'circle',
    shadow: false,
    borderRadius: 8
  };
  
  switch (nodeType) {
    case 'start':
      return { ...baseStyle, fillColor: '#10b981', borderColor: '#059669', icon: 'play' };
    case 'decision':
      return { ...baseStyle, fillColor: '#f59e0b', borderColor: '#d97706', icon: 'diamond' };
    case 'action':
      return { ...baseStyle, fillColor: '#3b82f6', borderColor: '#2563eb', icon: 'zap' };
    case 'process':
      return { ...baseStyle, fillColor: '#ffffff', borderColor: '#a855f7', textColor: '#1e293b', icon: 'settings', borderRadius: 16 };
    case 'connector':
      return { ...baseStyle, fillColor: '#ffffff', borderColor: '#64748b', textColor: '#64748b', icon: 'arrow-right' };
    case 'end':
      return { ...baseStyle, fillColor: '#ef4444', borderColor: '#dc2626', icon: 'square' };
    case 'document':
      return { ...baseStyle, fillColor: '#ffffff', borderColor: '#64748b', textColor: '#1e293b', icon: 'file-text' };
    case 'database':
      return { ...baseStyle, fillColor: '#ffffff', borderColor: '#6366f1', textColor: '#1e293b', icon: 'database' };
    case 'inputoutput':
      return { ...baseStyle, fillColor: '#ffffff', borderColor: '#14b8a6', textColor: '#1e293b', icon: 'arrow-right-left' };
    case 'annotation':
      return { ...baseStyle, fillColor: '#fef3c7', borderColor: '#f59e0b', textColor: '#92400e', icon: 'sticky-note' };
    default:
      return baseStyle;
  }
}