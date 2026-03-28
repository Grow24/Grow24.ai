import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface LayerState {
  selectedNodes: string[];
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    zIndex: number;
    nodeIds: string[];
  }>;
  groups: Array<{
    id: string;
    name: string;
    nodeIds: string[];
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
}

interface LayerActions {
  setSelectedNodes: (nodeIds: string[]) => void;
  addToSelection: (nodeId: string) => void;
  removeFromSelection: (nodeId: string) => void;
  clearSelection: () => void;
  createGroup: (nodeIds: string[], nodes: Node[]) => string;
  ungroup: (groupId: string) => void;
  updateLayer: (layerId: string, updates: Partial<LayerState['layers'][0]>) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
}

export const useLayerStore = create<LayerState & LayerActions>((set, get) => ({
  selectedNodes: [],
  layers: [
    {
      id: 'default',
      name: 'Default Layer',
      visible: true,
      locked: false,
      zIndex: 0,
      nodeIds: []
    }
  ],
  groups: [],

  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
  
  addToSelection: (nodeId) => set((state) => ({
    selectedNodes: [...new Set([...state.selectedNodes, nodeId])]
  })),
  
  removeFromSelection: (nodeId) => set((state) => ({
    selectedNodes: state.selectedNodes.filter(id => id !== nodeId)
  })),
  
  clearSelection: () => set({ selectedNodes: [] }),

  createGroup: (nodeIds, nodes) => {
    const groupId = `group-${Date.now()}`;
    const groupNodes = nodes.filter(n => nodeIds.includes(n.id));
    
    // Calculate bounding box
    const minX = Math.min(...groupNodes.map(n => n.position.x));
    const minY = Math.min(...groupNodes.map(n => n.position.y));
    const maxX = Math.max(...groupNodes.map(n => n.position.x + 150));
    const maxY = Math.max(...groupNodes.map(n => n.position.y + 80));
    
    const newGroup = {
      id: groupId,
      name: `Group ${get().groups.length + 1}`,
      nodeIds,
      position: { x: minX - 10, y: minY - 10 },
      size: { width: maxX - minX + 20, height: maxY - minY + 20 }
    };
    
    set((state) => ({
      groups: [...state.groups, newGroup],
      selectedNodes: []
    }));
    
    return groupId;
  },

  ungroup: (groupId) => set((state) => ({
    groups: state.groups.filter(g => g.id !== groupId)
  })),

  updateLayer: (layerId, updates) => set((state) => ({
    layers: state.layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    )
  })),

  reorderLayers: (fromIndex, toIndex) => set((state) => {
    const newLayers = [...state.layers];
    const [moved] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, moved);
    return { layers: newLayers };
  })
}));