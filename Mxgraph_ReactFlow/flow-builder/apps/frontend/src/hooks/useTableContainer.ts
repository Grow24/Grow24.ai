import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

export interface TableChild {
  id: string;
  row: number;
  col: number;
  type: 'shape' | 'image' | 'text' | 'node';
  nodeType?: string;
  data?: any;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface TableData {
  rows: number;
  cols: number;
  cells: string[][];
  children?: TableChild[];
  mergedCells?: Array<{ start: [number, number]; end: [number, number] }>;
  columnWidths: number[];
  rowHeights: number[];
  config?: {
    containerMode?: boolean;
    headerRow?: boolean;
    showRowHeaders?: boolean;
    showColumnHeaders?: boolean;
  };
}

export function useTableContainer(initialData: TableData, onChange?: (data: TableData) => void) {
  const [data, setData] = useState<TableData>(initialData);

  const updateData = useCallback((updates: Partial<TableData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onChange?.(newData);
  }, [data, onChange]);

  const addChild = useCallback((child: Omit<TableChild, 'id'>) => {
    const newChild: TableChild = {
      ...child,
      id: nanoid(),
    };
    updateData({
      children: [...(data.children || []), newChild]
    });
    return newChild.id;
  }, [data.children, updateData]);

  const removeChild = useCallback((childId: string) => {
    updateData({
      children: data.children?.filter(child => child.id !== childId) || []
    });
  }, [data.children, updateData]);

  const updateChild = useCallback((childId: string, updates: Partial<TableChild>) => {
    updateData({
      children: data.children?.map(child => 
        child.id === childId ? { ...child, ...updates } : child
      ) || []
    });
  }, [data.children, updateData]);

  const getChildrenInCell = useCallback((row: number, col: number) => {
    return data.children?.filter(child => child.row === row && child.col === col) || [];
  }, [data.children]);

  const isCellMerged = useCallback((row: number, col: number) => {
    return data.mergedCells?.some(merge => 
      row >= merge.start[0] && row <= merge.end[0] &&
      col >= merge.start[1] && col <= merge.end[1]
    ) || false;
  }, [data.mergedCells]);

  return {
    data,
    updateData,
    addChild,
    removeChild,
    updateChild,
    getChildrenInCell,
    isCellMerged,
  };
}