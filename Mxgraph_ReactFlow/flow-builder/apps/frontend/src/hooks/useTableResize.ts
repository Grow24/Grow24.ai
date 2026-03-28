import { useState, useCallback } from 'react';

interface UseTableResizeProps {
  columnWidths: number[];
  rowHeights: number[];
  onResize: (columnWidths: number[], rowHeights: number[]) => void;
}

export function useTableResize({ columnWidths, rowHeights, onResize }: UseTableResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'column' | 'row' | null>(null);
  const [resizeIndex, setResizeIndex] = useState<number>(-1);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(0);

  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    type: 'column' | 'row',
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeType(type);
    setResizeIndex(index);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize(type === 'column' ? columnWidths[index] : rowHeights[index]);

    const handleMouseMove = (e: MouseEvent) => {
      if (type === 'column') {
        const deltaX = e.clientX - startPosition.x;
        const newWidth = Math.max(60, startSize + deltaX);
        const newColumnWidths = [...columnWidths];
        newColumnWidths[index] = newWidth;
        onResize(newColumnWidths, rowHeights);
      } else {
        const deltaY = e.clientY - startPosition.y;
        const newHeight = Math.max(25, startSize + deltaY);
        const newRowHeights = [...rowHeights];
        newRowHeights[index] = newHeight;
        onResize(columnWidths, newRowHeights);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeType(null);
      setResizeIndex(-1);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths, rowHeights, onResize, startPosition, startSize]);

  return {
    isResizing,
    resizeType,
    resizeIndex,
    handleResizeStart,
  };
}