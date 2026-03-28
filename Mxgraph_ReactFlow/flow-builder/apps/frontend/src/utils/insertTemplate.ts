import { nanoid } from 'nanoid';

export const insertTemplate = (
  templateData: any,
  existingNodes: any[],
  existingEdges: any[],
  setNodes: any,
  setEdges: any,
  fitView: any,
  onLabelEdit?: any,
  onLabelChange?: any
) => {
  // Calculate offset to avoid overlap
  const offsetX = existingNodes.length > 0 ? 200 : 0;
  const offsetY = existingNodes.length > 0 ? 160 : 0;

  // Create ID mapping for nodes and edges
  const nodeIdMap = new Map();
  
  // Process nodes with new IDs and offset positions
  const newNodes = templateData.nodes.map((node: any) => {
    const newId = `${node.type}-${nanoid()}`;
    nodeIdMap.set(node.id, newId);
    
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY
      },
      data: {
        ...node.data,
        // Add onChange handler for visual nodes
        onChange: ['text', 'callout', 'image'].includes(node.type) ? (updates: any) => {
          setNodes((nds: any) => nds.map((n: any) => 
            n.id === newId ? { ...n, data: { ...n.data, ...updates } } : n
          ));
        } : undefined
      }
    };
  });

  // Process edges with updated node references
  const newEdges = templateData.edges.map((edge: any) => ({
    ...edge,
    id: `edge-${nanoid()}`,
    source: nodeIdMap.get(edge.source),
    target: nodeIdMap.get(edge.target),
    data: {
      ...edge.data,
      onLabelEdit,
      onLabelChange,
    },
    style: edge.style || {
      strokeColor: '#64748b',
      strokeWidth: 2,
      style: 'straight',
      arrowHead: 'triangle',
      dashed: false,
      labelBgColor: '#ffffff'
    }
  }));

  // Add to existing canvas
  setNodes([...existingNodes, ...newNodes]);
  setEdges([...existingEdges, ...newEdges]);

  // Focus on inserted template
  setTimeout(() => {
    fitView({ 
      nodes: newNodes, 
      duration: 600,
      padding: 0.2
    });
  }, 100);

  return { nodes: newNodes, edges: newEdges };
};