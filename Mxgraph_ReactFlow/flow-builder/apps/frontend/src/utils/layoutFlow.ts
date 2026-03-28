// Auto-layout utility for Draw.io style hierarchical arrangement
export async function layoutFlow(nodes: any[], edges: any[], direction = "DOWN") {
  // Simple hierarchical layout algorithm
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const positioned = new Set<string>();
  const layers: string[][] = [];
  
  // Find start nodes (no incoming edges)
  const startNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  if (startNodes.length === 0) return nodes;
  
  // Layer-by-layer positioning
  let currentLayer = startNodes.map(n => n.id);
  layers.push([...currentLayer]);
  
  while (currentLayer.length > 0) {
    const nextLayer: string[] = [];
    
    currentLayer.forEach(nodeId => {
      positioned.add(nodeId);
      const outgoingEdges = edges.filter(e => e.source === nodeId);
      outgoingEdges.forEach(edge => {
        if (!positioned.has(edge.target) && !nextLayer.includes(edge.target)) {
          nextLayer.push(edge.target);
        }
      });
    });
    
    if (nextLayer.length > 0) {
      layers.push(nextLayer);
    }
    currentLayer = nextLayer;
  }
  
  // Position nodes in layers
  const layoutedNodes = nodes.map(node => {
    const layerIndex = layers.findIndex(layer => layer.includes(node.id));
    const positionInLayer = layers[layerIndex]?.indexOf(node.id) || 0;
    const layerSize = layers[layerIndex]?.length || 1;
    
    const x = direction === "RIGHT" 
      ? layerIndex * 220 + 100
      : (positionInLayer - (layerSize - 1) / 2) * 220 + 400;
    
    const y = direction === "RIGHT"
      ? (positionInLayer - (layerSize - 1) / 2) * 100 + 300
      : layerIndex * 100 + 100;
    
    return {
      ...node,
      position: { x, y }
    };
  });
  
  return layoutedNodes;
}