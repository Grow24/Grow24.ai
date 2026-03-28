import React, { useState } from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff, Lock, Unlock, Layers, Group, Ungroup } from 'lucide-react';

interface LayerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export function LayerPanel({ isOpen, onClose, onGroup, onUngroup }: LayerPanelProps) {
  const [layers] = useState([
    {
      id: 'default',
      name: 'Default Layer',
      visible: true,
      locked: false,
      zIndex: 0,
      nodeIds: []
    }
  ]);
  const [groups] = useState<Array<{id: string; nodeIds: string[]}>>([]);
  const selectedNodes: string[] = [];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40" onClick={onClose} />
      
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 border-r border-slate-200 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Layers & Groups</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Group Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Group Actions</h3>
            <div className="flex gap-2">
              <Button
                onClick={onGroup}
                disabled={true}
                size="sm"
                className="flex-1 gap-2"
              >
                <Group className="w-4 h-4" />
                Group (0)
              </Button>
              <Button
                onClick={onUngroup}
                disabled={groups.length === 0}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Ungroup className="w-4 h-4" />
                Ungroup
              </Button>
            </div>
          </div>

          {/* Groups */}
          {groups.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900">Groups</h3>
              <div className="space-y-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded border"
                  >
                    <Group className="w-4 h-4 text-slate-500" />
                    <span className="flex-1 text-sm">{group.name}</span>
                    <span className="text-xs text-slate-500">
                      {group.nodeIds.length} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layers */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Layers</h3>
            <div className="space-y-2">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded border"
                >
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                    >
                      <Unlock className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <span className="flex-1 text-sm">{layer.name}</span>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      disabled={true}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      disabled={true}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}