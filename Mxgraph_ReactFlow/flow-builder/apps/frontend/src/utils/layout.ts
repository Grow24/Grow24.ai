import { Node, Edge } from '@xyflow/react';

type LayoutStyle = 'standard' | 'compact' | 'freeform';

interface LayoutConfig {
  style: LayoutStyle;
  direction: 'LR' | 'TB' | 'RL' | 'BT';
  nodeSpacing: { x: number; y: number };
  rankSpacing: number;
}

const LAYOUT_CONFIGS: Record<LayoutStyle, LayoutConfig> = {
  standard: {
    style: 'standard',
    direction: 'TB',
    nodeSpacing: { x: 200, y: 120 },
    rankSpacing: 200
  },
  compact: {
    style: 'compact', 
    direction: 'TB',
    nodeSpacing: { x: 150, y: 80 },
    rankSpacing: 150
  },
  freeform: {
    style: 'freeform',
    direction: 'TB', 
    nodeSpacing: { x: 250, y: 150 },
    rankSpacing: 250
  }
};

export function autoLayoutNodes(nodes: Node[], edges: Edge[], layoutStyle: LayoutStyle = 'standard'): Node[] {
  if (nodes.length === 0) return nodes;
  
  const config = LAYOUT_CONFIGS[layoutStyle];
  
  // Build adjacency list for flow direction
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  // Initialize
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  // Build graph
  edges.forEach(edge => {
    const sourceTargets = adjacencyList.get(edge.source) || [];
    sourceTargets.push(edge.target);
    adjacencyList.set(edge.source, sourceTargets);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });
  
  // Topological sort for hierarchical layout
  const ranks: string[][] = [];
  const queue: string[] = [];
  const visited = new Set<string>();
  
  // Find start nodes (no incoming edges)
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });
  
  // If no start nodes found, use first node
  if (queue.length === 0 && nodes.length > 0) {
    queue.push(nodes[0].id);
  }
  
  // Process nodes level by level
  while (queue.length > 0) {
    const currentRank: string[] = [];
    const nextQueue: string[] = [];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      
      visited.add(nodeId);
      currentRank.push(nodeId);
      
      // Add children to next level
      const children = adjacencyList.get(nodeId) || [];
      children.forEach(childId => {
        if (!visited.has(childId)) {
          const newInDegree = (inDegree.get(childId) || 0) - 1;
          inDegree.set(childId, newInDegree);
          if (newInDegree === 0) {
            nextQueue.push(childId);
          }
        }
      });
    }
    
    if (currentRank.length > 0) {
      ranks.push(currentRank);
    }
    
    queue.push(...nextQueue);
  }
  
  // Add any remaining unvisited nodes
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      ranks.push([node.id]);
    }
  });
  
  // Calculate positions based on layout direction
  const nodePositions = new Map<string, { x: number; y: number }>();
  
  ranks.forEach((rank, rankIndex) => {
    rank.forEach((nodeId, nodeIndex) => {
      let x: number, y: number;
      
      if (config.direction === 'LR') {
        x = 100 + rankIndex * config.rankSpacing;
        y = 100 + (nodeIndex - (rank.length - 1) / 2) * config.nodeSpacing.y;
      } else if (config.direction === 'TB') {
        x = 100 + (nodeIndex - (rank.length - 1) / 2) * config.nodeSpacing.x;
        y = 100 + rankIndex * config.rankSpacing;
      } else if (config.direction === 'RL') {
        x = 100 + (ranks.length - 1 - rankIndex) * config.rankSpacing;
        y = 100 + (nodeIndex - (rank.length - 1) / 2) * config.nodeSpacing.y;
      } else { // BT
        x = 100 + (nodeIndex - (rank.length - 1) / 2) * config.nodeSpacing.x;
        y = 100 + (ranks.length - 1 - rankIndex) * config.rankSpacing;
      }
      
      nodePositions.set(nodeId, { x, y });
    });
  });
  
  // Apply positions to nodes
  return nodes.map(node => {
    const position = nodePositions.get(node.id) || node.position;
    return {
      ...node,
      position,
      data: {
        ...node.data,
        layoutStyle: config.style
      }
    };
  });
}

export function snapToGrid(position: { x: number; y: number }, gridSize: number = 20): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

export function getLayoutStyles(): LayoutStyle[] {
  return ['standard', 'compact', 'freeform'];
}

export function applyDrawioStyling(nodes: Node[]): Node[] {
  return nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      style: {
        ...node.data.style,
        // Draw.io standard styling
        borderRadius: getDrawioRadius(node.type),
        shadow: true,
        fontSize: 13,
        fontFamily: 'Inter, Roboto, sans-serif',
        fillColor: getDrawioColor(node.type),
        borderColor: getDrawioBorderColor(node.type),
        borderWidth: 1,
        textColor: getDrawioTextColor(node.type)
      }
    }
  }));
}

function getDrawioRadius(nodeType?: string): number {
  switch (nodeType) {
    case 'start':
    case 'end':
      return 50; // Oval
    case 'decision':
      return 0; // Diamond
    case 'process':
    case 'action':
      return 8; // Rounded rectangle
    case 'document':
      return 4; // Slight curve
    default:
      return 8;
  }
}

function getDrawioColor(nodeType?: string): string {
  switch (nodeType) {
    case 'start':
    case 'end':
      return '#e1f5fe'; // Light blue
    case 'process':
      return '#f3e5f5'; // Light purple
    case 'action':
      return '#e8f5e8'; // Light green
    case 'decision':
      return '#fff3e0'; // Light orange
    case 'document':
      return '#f5f5f5'; // Light grey
    default:
      return '#ffffff';
  }
}

function getDrawioBorderColor(nodeType?: string): string {
  switch (nodeType) {
    case 'start':
    case 'end':
      return '#0277bd';
    case 'process':
      return '#7b1fa2';
    case 'action':
      return '#388e3c';
    case 'decision':
      return '#f57c00';
    case 'document':
      return '#616161';
    default:
      return '#9e9e9e';
  }
}

function getDrawioTextColor(nodeType?: string): string {
  switch (nodeType) {
    case 'start':
    case 'end':
      return '#01579b';
    case 'process':
      return '#4a148c';
    case 'action':
      return '#1b5e20';
    case 'decision':
      return '#e65100';
    case 'document':
      return '#212121';
    default:
      return '#424242';
  }
}