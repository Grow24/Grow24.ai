import { Edge, Node } from '@xyflow/react';

// Sync edge labels with decision node condition labels
export const syncDecisionEdgeLabels = (
  nodes: Node[],
  edges: Edge[],
  updatedNodeId: string,
  conditions: Array<{ id: string; label: string }>
): Edge[] => {
  const updatedNode = nodes.find(n => n.id === updatedNodeId);
  if (!updatedNode || updatedNode.type !== 'decision') {
    return edges;
  }

  return edges.map(edge => {
    // Only update edges that originate from this decision node
    if (edge.source !== updatedNodeId) {
      return edge;
    }

    // Find matching condition by sourceHandle (condition ID)
    const matchingCondition = conditions.find(c => c.id === edge.sourceHandle);
    if (matchingCondition) {
      return {
        ...edge,
        label: matchingCondition.label,
        animated: true,
      };
    }

    // Handle default path
    if (edge.sourceHandle === 'default') {
      return {
        ...edge,
        label: 'Default',
        animated: false,
      };
    }

    return edge;
  });
};