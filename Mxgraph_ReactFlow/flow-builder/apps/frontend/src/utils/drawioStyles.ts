import { Node, Edge } from '@xyflow/react';

export function applyDrawioStyleToTemplate(nodes: Node[], edges: Edge[]): { nodes: Node[], edges: Edge[] } {
  const styledNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      style: node.data.style || getDrawioNodeStyle(node.type)
    }
  }));

  const styledEdges = edges.map(edge => ({
    ...edge,
    type: 'orthogonal',
    style: edge.style || getDrawioEdgeStyle(edge.label)
  }));

  return { nodes: styledNodes, edges: styledEdges };
}

function getDrawioNodeStyle(nodeType?: string) {
  const baseStyle = {
    fontSize: 13,
    fontFamily: 'Inter, Roboto, sans-serif',
    borderWidth: 1,
    shadow: true
  };

  switch (nodeType) {
    case 'start':
    case 'end':
      return {
        ...baseStyle,
        fillColor: '#e1f5fe',
        borderColor: '#0277bd',
        textColor: '#01579b',
        borderRadius: 50
      };
    case 'process':
      return {
        ...baseStyle,
        fillColor: '#f3e5f5',
        borderColor: '#7b1fa2',
        textColor: '#4a148c',
        borderRadius: 8
      };
    case 'action':
      return {
        ...baseStyle,
        fillColor: '#e8f5e8',
        borderColor: '#388e3c',
        textColor: '#1b5e20',
        borderRadius: 8
      };
    case 'decision':
      return {
        ...baseStyle,
        fillColor: '#fff3e0',
        borderColor: '#f57c00',
        textColor: '#e65100',
        borderRadius: 0
      };
    case 'document':
    case 'annotation':
      return {
        ...baseStyle,
        fillColor: '#f5f5f5',
        borderColor: '#616161',
        textColor: '#212121',
        borderRadius: 4
      };
    default:
      return {
        ...baseStyle,
        fillColor: '#ffffff',
        borderColor: '#9e9e9e',
        textColor: '#424242',
        borderRadius: 8
      };
  }
}

function getDrawioEdgeStyle(label?: string) {
  const baseStyle = {
    strokeWidth: 1,
    style: 'orthogonal',
    arrowHead: 'triangle',
    labelBgColor: '#ffffff'
  };

  if (label === 'Yes') {
    return { ...baseStyle, strokeColor: '#388e3c' };
  } else if (label === 'No') {
    return { ...baseStyle, strokeColor: '#f57c00' };
  } else if (label && (label.includes('Retry') || label.includes('Loop'))) {
    return { ...baseStyle, strokeColor: '#9e9e9e', dashed: true };
  } else {
    return { ...baseStyle, strokeColor: '#424242' };
  }
}