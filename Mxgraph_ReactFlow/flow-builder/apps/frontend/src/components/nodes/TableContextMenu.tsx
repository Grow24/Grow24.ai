import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface TableContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  cellPosition: { row: number; col: number };
  onClose: () => void;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onAddColumn: () => void;
  onDeleteColumn: () => void;
  onClearCell: () => void;
  onAddShape?: (row: number, col: number, shapeType: string) => void;
  onMergeCells?: () => void;
  onSplitCell?: (row: number, col: number) => void;
  isContainerMode?: boolean;
}

export function TableContextMenu({
  isOpen,
  position,
  cellPosition,
  onClose,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onClearCell,
  onAddShape,
  onMergeCells,
  onSplitCell,
  isContainerMode = false
}: TableContextMenuProps) {
  console.log('TableContextMenu render - isOpen:', isOpen, 'position:', position);
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9999]" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed z-[10000] bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-48"
        style={{
          left: Math.min(position.x, window.innerWidth - 200),
          top: Math.min(position.y, window.innerHeight - 300),
          pointerEvents: 'auto'
        }}
      >
        <div className="px-3 py-1 text-xs text-slate-500 border-b border-slate-100">
          Cell ({cellPosition.row + 1}, {cellPosition.col + 1})
        </div>
        
        <button
          onClick={() => handleAction(onAddRow)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-green-600" />
          Add Row Below
        </button>
        
        <button
          onClick={() => handleAction(onDeleteRow)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <Minus className="w-4 h-4 text-red-600" />
          Delete Row
        </button>
        
        <div className="border-t border-slate-100 my-1" />
        
        <button
          onClick={() => handleAction(onAddColumn)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-blue-600" />
          Add Column Right
        </button>
        
        <button
          onClick={() => handleAction(onDeleteColumn)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <Minus className="w-4 h-4 text-red-600" />
          Delete Column
        </button>
        
        <div className="border-t border-slate-100 my-1" />
        
        <button
          onClick={() => handleAction(onClearCell)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4 text-slate-600" />
          Clear Cell
        </button>
        
        {isContainerMode && (
          <>
            <div className="border-t border-slate-100 my-1" />
            <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
              Add Shape
            </div>
            <button
              onClick={() => handleAction(() => onAddShape?.(cellPosition.row, cellPosition.col, 'rectangle'))}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <div className="w-4 h-4 border border-slate-400 bg-blue-100" />
              Rectangle
            </button>
            <button
              onClick={() => handleAction(() => onAddShape?.(cellPosition.row, cellPosition.col, 'circle'))}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <div className="w-4 h-4 rounded-full border border-slate-400 bg-green-100" />
              Circle
            </button>
            <button
              onClick={() => handleAction(() => onAddShape?.(cellPosition.row, cellPosition.col, 'diamond'))}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <div className="w-4 h-4 transform rotate-45 border border-slate-400 bg-yellow-100" />
              Diamond
            </button>
            
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={() => handleAction(() => onMergeCells?.())}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
              Merge Cells
            </button>
            <button
              onClick={() => handleAction(() => onSplitCell?.(cellPosition.row, cellPosition.col))}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm8 0a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" />
              </svg>
              Split Cell
            </button>
          </>
        )}
      </div>
    </>
  );
}