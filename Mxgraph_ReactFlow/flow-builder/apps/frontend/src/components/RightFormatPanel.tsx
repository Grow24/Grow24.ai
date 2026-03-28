import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { X, Palette, Paintbrush, Type, Zap } from 'lucide-react';

interface RightFormatPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNode: (nodeId: string, style: any) => void;
  onUpdateEdge: (edgeId: string, style: any) => void;
}

const defaultNodeStyle = {
  fillColor: '#ffffff',
  borderColor: '#64748b',
  borderWidth: 2,
  borderStyle: 'solid',
  textColor: '#1e293b',
  fontSize: 14,
  icon: 'circle',
  shadow: false,
  borderRadius: 8
};

const defaultEdgeStyle = {
  strokeColor: '#64748b',
  strokeWidth: 2,
  style: 'bezier',
  arrowHead: 'triangle',
  dashed: false,
  labelBgColor: '#ffffff'
};

export function RightFormatPanel({ 
  selectedNode, 
  selectedEdge, 
  isOpen, 
  onClose, 
  onUpdateNode, 
  onUpdateEdge 
}: RightFormatPanelProps) {
  if (!isOpen || (!selectedNode && !selectedEdge)) {
    return null;
  }

  const isNode = !!selectedNode;
  const currentStyle = React.useMemo(() => {
    return isNode 
      ? { ...defaultNodeStyle, ...(selectedNode?.data?.style || {}) }
      : { ...defaultEdgeStyle, ...(selectedEdge?.style || {}) };
  }, [isNode, selectedNode?.data?.style, selectedEdge?.style]);

  const handleStyleChange = React.useCallback((key: string, value: any) => {
    if (isNode && selectedNode) {
      onUpdateNode(selectedNode.id, { [key]: value });
    } else if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { [key]: value });
    }
  }, [isNode, selectedNode, selectedEdge, onUpdateNode, onUpdateEdge]);

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => {
            e.stopPropagation();
            onChange(e.target.value);
          }}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
        />
        <Input
          value={value || ''}
          onChange={(e) => {
            e.stopPropagation();
            onChange(e.target.value);
          }}
          onKeyDown={(e) => e.stopPropagation()}
          className="flex-1 h-8 text-xs font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const NumberInput = ({ label, value, onChange, min = 0, max = 100, step = 1 }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
    min?: number; 
    max?: number; 
    step?: number;
  }) => (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || 0}
        onChange={(e) => {
          e.stopPropagation();
          onChange(parseInt(e.target.value) || 0);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="h-8 text-xs"
      />
    </div>
  );

  const SelectInput = ({ label, value, onChange, options }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <select
        value={value || ''}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="w-full h-8 px-2 border border-slate-300 rounded text-xs bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );

  const renderNodeStyles = () => (
    <div className="space-y-6">
      {/* Fill & Stroke Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Paintbrush className="w-4 h-4 text-slate-500" />
          <h4 className="font-medium text-slate-900 text-sm">Fill & Stroke</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            label="Fill Color"
            value={currentStyle.fillColor}
            onChange={(value) => handleStyleChange('fillColor', value)}
          />
          <ColorPicker
            label="Border Color"
            value={currentStyle.borderColor}
            onChange={(value) => handleStyleChange('borderColor', value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Border Width"
            value={currentStyle.borderWidth}
            onChange={(value) => handleStyleChange('borderWidth', value)}
            min={0}
            max={10}
          />
          <SelectInput
            label="Border Style"
            value={currentStyle.borderStyle}
            onChange={(value) => handleStyleChange('borderStyle', value)}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' }
            ]}
          />
        </div>

        {(selectedNode?.type === 'process' || selectedNode?.type === 'action') && (
          <NumberInput
            label="Border Radius"
            value={currentStyle.borderRadius}
            onChange={(value) => handleStyleChange('borderRadius', value)}
            min={0}
            max={50}
          />
        )}
      </div>

      {/* Typography Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Type className="w-4 h-4 text-slate-500" />
          <h4 className="font-medium text-slate-900 text-sm">Typography</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            label="Text Color"
            value={currentStyle.textColor}
            onChange={(value) => handleStyleChange('textColor', value)}
          />
          <NumberInput
            label="Font Size"
            value={currentStyle.fontSize}
            onChange={(value) => handleStyleChange('fontSize', value)}
            min={8}
            max={24}
          />
        </div>
      </div>

      {/* Icon & Effects Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Zap className="w-4 h-4 text-slate-500" />
          <h4 className="font-medium text-slate-900 text-sm">Icon & Effects</h4>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">Icon (Lucide name)</Label>
            <Input
              value={currentStyle.icon}
              onChange={(e) => {
                e.stopPropagation();
                handleStyleChange('icon', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="play, zap, settings, etc."
              className="h-8 text-xs"
            />
            <p className="text-xs text-slate-500">
              Use Lucide icon names like: play, zap, settings, mail, database, etc.
            </p>
          </div>
          
          <ToggleSwitch
            label="Drop Shadow"
            checked={currentStyle.shadow}
            onChange={(checked) => handleStyleChange('shadow', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderEdgeStyles = () => (
    <div className="space-y-6">
      {/* Stroke Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Paintbrush className="w-4 h-4 text-slate-500" />
          <h4 className="font-medium text-slate-900 text-sm">Stroke</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            label="Stroke Color"
            value={currentStyle.strokeColor}
            onChange={(value) => handleStyleChange('strokeColor', value)}
          />
          <NumberInput
            label="Stroke Width"
            value={currentStyle.strokeWidth}
            onChange={(value) => handleStyleChange('strokeWidth', value)}
            min={1}
            max={10}
          />
        </div>
      </div>

      {/* Path Style Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h4 className="font-medium text-slate-900 text-sm">Path Style</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Edge Style"
            value={currentStyle.style}
            onChange={(value) => handleStyleChange('style', value)}
            options={[
              { value: 'bezier', label: 'Bezier' },
              { value: 'straight', label: 'Straight' },
              { value: 'step', label: 'Step' },
              { value: 'orthogonal', label: 'Orthogonal' }
            ]}
          />
          <SelectInput
            label="Arrow Head"
            value={currentStyle.arrowHead}
            onChange={(value) => handleStyleChange('arrowHead', value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'triangle', label: 'Triangle' },
              { value: 'diamond', label: 'Diamond' }
            ]}
          />
        </div>
        
        <ToggleSwitch
          label="Dashed Line"
          checked={currentStyle.dashed}
          onChange={(checked) => handleStyleChange('dashed', checked)}
        />
      </div>

      {/* Label Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Type className="w-4 h-4 text-slate-500" />
          <h4 className="font-medium text-slate-900 text-sm">Label</h4>
        </div>
        
        <ColorPicker
          label="Label Background"
          value={currentStyle.labelBgColor}
          onChange={(value) => handleStyleChange('labelBgColor', value)}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Format</h2>
                <p className="text-xs text-slate-500">
                  {isNode 
                    ? `${selectedNode?.type?.charAt(0).toUpperCase()}${selectedNode?.type?.slice(1)} Node` 
                    : 'Edge Connection'
                  }
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isNode ? renderNodeStyles() : renderEdgeStyles()}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {isNode ? `Node ID: ${selectedNode?.id}` : `Edge ID: ${selectedEdge?.id}`}
            </div>
            <Button 
              onClick={() => {
                // Force a re-render to apply changes
                if (isNode && selectedNode) {
                  onUpdateNode(selectedNode.id, {});
                } else if (selectedEdge) {
                  onUpdateEdge(selectedEdge.id, {});
                }
              }}
              size="sm"
              className="text-xs"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}