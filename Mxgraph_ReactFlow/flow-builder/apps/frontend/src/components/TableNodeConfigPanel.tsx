import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface TableConfig {
  headerRow?: boolean;
  cellPadding?: number;
  textAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'solid' | 'dashed' | 'none';
  borderColor?: string;
  containerMode?: boolean;
  showRowHeaders?: boolean;
  showColumnHeaders?: boolean;
}

interface TableNodeConfigPanelProps {
  rows: number;
  cols: number;
  config: TableConfig;
  onUpdateRows: (rows: number) => void;
  onUpdateCols: (cols: number) => void;
  onUpdateConfig: (config: TableConfig) => void;
}

export function TableNodeConfigPanel({
  rows,
  cols,
  config,
  onUpdateRows,
  onUpdateCols,
  onUpdateConfig
}: TableNodeConfigPanelProps) {
  const updateConfig = (updates: Partial<TableConfig>) => {
    onUpdateConfig({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Table Dimensions */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Table Dimensions</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rows</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => onUpdateRows(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Columns</label>
            <Input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => onUpdateCols(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table Styling */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Styling</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="containerMode"
              checked={config.containerMode || false}
              onChange={(e) => updateConfig({ containerMode: e.target.checked })}
              className="rounded border-slate-300"
            />
            <label htmlFor="containerMode" className="text-sm text-slate-700 font-medium">
              Container Mode (hold shapes & diagrams)
            </label>
          </div>
          
          {config.containerMode && (
            <div className="ml-6 space-y-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showRowHeaders"
                  checked={config.showRowHeaders !== false}
                  onChange={(e) => updateConfig({ showRowHeaders: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="showRowHeaders" className="text-xs text-slate-700">
                  Show row headers
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showColumnHeaders"
                  checked={config.showColumnHeaders !== false}
                  onChange={(e) => updateConfig({ showColumnHeaders: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="showColumnHeaders" className="text-xs text-slate-700">
                  Show column headers
                </label>
              </div>
              <p className="text-xs text-blue-700">
                💡 Container cells can hold flow nodes, shapes, and diagrams
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="headerRow"
              checked={config.headerRow || false}
              onChange={(e) => updateConfig({ headerRow: e.target.checked })}
              className="rounded border-slate-300"
            />
            <label htmlFor="headerRow" className="text-sm text-slate-700">
              Header Row (bold styling)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cell Padding: {config.cellPadding || 8}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={config.cellPadding || 8}
              onChange={(e) => updateConfig({ cellPadding: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Text Alignment</label>
            <select
              value={config.textAlign || 'left'}
              onChange={(e) => updateConfig({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Border Style</label>
            <select
              value={config.borderStyle || 'solid'}
              onChange={(e) => updateConfig({ borderStyle: e.target.value as 'solid' | 'dashed' | 'none' })}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="none">None</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.borderColor || '#E0E0E0'}
                onChange={(e) => updateConfig({ borderColor: e.target.value })}
                className="w-8 h-8 border border-slate-300 rounded"
              />
              <Input
                type="text"
                value={config.borderColor || '#E0E0E0'}
                onChange={(e) => updateConfig({ borderColor: e.target.value })}
                className="text-sm font-mono"
                placeholder="#E0E0E0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}