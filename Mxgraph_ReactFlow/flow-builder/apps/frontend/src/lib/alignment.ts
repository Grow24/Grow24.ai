import { Node } from '@xyflow/react';

export interface AlignmentOptions {
  snapToGrid: boolean;
  gridSize: number;
}

export const alignNodes = (nodes: Node[], direction: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle'): Node[] => {
  if (nodes.length < 2) return nodes;

  const bounds = getNodesBounds(nodes);
  
  return nodes.map(node => {
    let newPosition = { ...node.position };
    
    switch (direction) {
      case 'left':
        newPosition.x = bounds.minX;
        break;
      case 'right':
        newPosition.x = bounds.maxX - (node.width || 150);
        break;
      case 'top':
        newPosition.y = bounds.minY;
        break;
      case 'bottom':
        newPosition.y = bounds.maxY - (node.height || 40);
        break;
      case 'center':
        newPosition.x = bounds.centerX - (node.width || 150) / 2;
        break;
      case 'middle':
        newPosition.y = bounds.centerY - (node.height || 40) / 2;
        break;
    }
    
    return { ...node, position: newPosition };
  });
};

export const distributeNodes = (nodes: Node[], direction: 'horizontal' | 'vertical'): Node[] => {
  if (nodes.length < 3) return nodes;

  const sortedNodes = [...nodes].sort((a, b) => 
    direction === 'horizontal' ? a.position.x - b.position.x : a.position.y - b.position.y
  );

  const first = sortedNodes[0];
  const last = sortedNodes[sortedNodes.length - 1];
  
  const totalSpace = direction === 'horizontal' 
    ? last.position.x - first.position.x
    : last.position.y - first.position.y;
    
  const spacing = totalSpace / (sortedNodes.length - 1);

  return sortedNodes.map((node, index) => {
    if (index === 0 || index === sortedNodes.length - 1) return node;
    
    const newPosition = { ...node.position };
    if (direction === 'horizontal') {
      newPosition.x = first.position.x + spacing * index;
    } else {
      newPosition.y = first.position.y + spacing * index;
    }
    
    return { ...node, position: newPosition };
  });
};

export const snapToGrid = (position: { x: number; y: number }, gridSize: number) => ({
  x: Math.round(position.x / gridSize) * gridSize,
  y: Math.round(position.y / gridSize) * gridSize,
});

export const getSmartGuides = (
  draggedNode: Node,
  otherNodes: Node[],
  threshold: number = 5
): { x: number[]; y: number[] } => {
  const guides = { x: [] as number[], y: [] as number[] };
  
  otherNodes.forEach(node => {
    if (node.id === draggedNode.id) return;
    
    const nodeWidth = node.width || 150;
    const nodeHeight = node.height || 40;
    const draggedWidth = draggedNode.width || 150;
    const draggedHeight = draggedNode.height || 40;
    
    // Vertical guides (x-axis alignment)
    const xPositions = [
      node.position.x, // left edge
      node.position.x + nodeWidth / 2, // center
      node.position.x + nodeWidth, // right edge
    ];
    
    xPositions.forEach(x => {
      if (Math.abs(draggedNode.position.x - x) <= threshold ||
          Math.abs(draggedNode.position.x + draggedWidth / 2 - x) <= threshold ||
          Math.abs(draggedNode.position.x + draggedWidth - x) <= threshold) {
        guides.x.push(x);
      }
    });
    
    // Horizontal guides (y-axis alignment)
    const yPositions = [
      node.position.y, // top edge
      node.position.y + nodeHeight / 2, // middle
      node.position.y + nodeHeight, // bottom edge
    ];
    
    yPositions.forEach(y => {
      if (Math.abs(draggedNode.position.y - y) <= threshold ||
          Math.abs(draggedNode.position.y + draggedHeight / 2 - y) <= threshold ||
          Math.abs(draggedNode.position.y + draggedHeight - y) <= threshold) {
        guides.y.push(y);
      }
    });
  });
  
  return {
    x: [...new Set(guides.x)],
    y: [...new Set(guides.y)]
  };
};

const getNodesBounds = (nodes: Node[]) => {
  const positions = nodes.map(node => ({
    x: node.position.x,
    y: node.position.y,
    width: node.width || 150,
    height: node.height || 40,
  }));

  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x + p.width));
  const minY = Math.min(...positions.map(p => p.y));
  const maxY = Math.max(...positions.map(p => p.y + p.height));

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
};