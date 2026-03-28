export interface GraphNode {
  id: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export class FlowGraph {
  private adjacencyList: Map<string, string[]> = new Map();
  
  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    // Initialize adjacency list
    nodes.forEach(node => {
      this.adjacencyList.set(node.id, []);
    });
    
    // Build adjacency list
    edges.forEach(edge => {
      const neighbors = this.adjacencyList.get(edge.source) || [];
      neighbors.push(edge.target);
      this.adjacencyList.set(edge.source, neighbors);
    });
  }
  
  isReachable(from: string, to: string): boolean {
    const visited = new Set<string>();
    const queue = [from];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current === to) {
        return true;
      }
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      const neighbors = this.adjacencyList.get(current) || [];
      queue.push(...neighbors);
    }
    
    return false;
  }
  
  getReachableNodes(from: string): string[] {
    const visited = new Set<string>();
    const queue = [from];
    const reachable: string[] = [];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      reachable.push(current);
      
      const neighbors = this.adjacencyList.get(current) || [];
      queue.push(...neighbors);
    }
    
    return reachable;
  }
}