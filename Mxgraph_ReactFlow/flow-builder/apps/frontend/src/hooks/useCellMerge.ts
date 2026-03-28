import { useState, useCallback } from 'react';

export interface CellSelection {
  start: [number, number];
  end: [number, number];
}

export interface MergedCell {
  start: [number, number];
  end: [number, number];
}

export function useCellMerge() {
  const [selectedCells, setSelectedCells] = useState<CellSelection | null>(null);

  const startSelection = useCallback((row: number, col: number) => {
    setSelectedCells({ start: [row, col], end: [row, col] });
  }, []);

  const updateSelection = useCallback((row: number, col: number) => {
    setSelectedCells(prev => prev ? { ...prev, end: [row, col] } : null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCells(null);
  }, []);

  const mergeCells = useCallback((
    mergedCells: MergedCell[], 
    onUpdate: (merged: MergedCell[]) => void
  ) => {
    if (!selectedCells) return;

    const newMerge: MergedCell = {
      start: [
        Math.min(selectedCells.start[0], selectedCells.end[0]),
        Math.min(selectedCells.start[1], selectedCells.end[1])
      ],
      end: [
        Math.max(selectedCells.start[0], selectedCells.end[0]),
        Math.max(selectedCells.start[1], selectedCells.end[1])
      ]
    };

    // Only merge if more than one cell is selected
    if (newMerge.start[0] === newMerge.end[0] && newMerge.start[1] === newMerge.end[1]) {
      return;
    }

    onUpdate([...mergedCells, newMerge]);
    clearSelection();
  }, [selectedCells, clearSelection]);

  const splitCell = useCallback((
    row: number, 
    col: number, 
    mergedCells: MergedCell[], 
    onUpdate: (merged: MergedCell[]) => void
  ) => {
    const updatedMerged = mergedCells.filter(merge => 
      !(row >= merge.start[0] && row <= merge.end[0] &&
        col >= merge.start[1] && col <= merge.end[1])
    );
    onUpdate(updatedMerged);
  }, []);

  const getCellSpan = useCallback((row: number, col: number, mergedCells: MergedCell[]) => {
    const merge = mergedCells.find(merge => 
      row >= merge.start[0] && row <= merge.end[0] &&
      col >= merge.start[1] && col <= merge.end[1]
    );

    if (merge) {
      return {
        rowSpan: merge.end[0] - merge.start[0] + 1,
        colSpan: merge.end[1] - merge.start[1] + 1,
        isTopLeft: row === merge.start[0] && col === merge.start[1]
      };
    }

    return { rowSpan: 1, colSpan: 1, isTopLeft: true };
  }, []);

  return {
    selectedCells,
    startSelection,
    updateSelection,
    clearSelection,
    mergeCells,
    splitCell,
    getCellSpan,
  };
}