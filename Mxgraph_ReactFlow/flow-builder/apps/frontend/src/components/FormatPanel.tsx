import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select } from './ui/select';
import { X, Palette } from 'lucide-react';

interface FormatPanelProps {
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

export function FormatPanel({ 
  selectedNode, 
  selectedEdge, 
  isOpen, 
  onClose, 
  onUpdateNode, 
  onUpdateEdge 
}: FormatPanelProps) {
  if (!isOpen || (!selectedNode && !selectedEdge)) {
    return null;
  }

  const isNode = !!selectedNode;
  const currentStyle = isNode 
    ? { ...defaultNodeStyle, ...(selectedNode?.data?.style || {}) }
    : { ...defaultEdgeStyle, ...(selectedEdge?.style || {}) };

  const handleStyleChange = (key: string, value: any) => {
    const newStyle = { ...currentStyle, [key]: value };
    
    if (isNode && selectedNode) {
      onUpdateNode(selectedNode.id, newStyle);
    } else if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, newStyle);
    }
  };

  const renderNodeStyles = () => (
    <div className="space-y-6">
      {/* Fill & Border */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Fill & Border</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fill Color</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={currentStyle.fillColor}
                onChange={(e) => handleStyleChange('fillColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-300"
              />
              <Input
                value={currentStyle.fillColor}
                onChange={(e) => handleStyleChange('fillColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label>Border Color</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={currentStyle.borderColor}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-300"
              />
              <Input
                value={currentStyle.borderColor}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Border Width</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={currentStyle.borderWidth}
              onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value) || 0)}
              className="h-8 mt-1"
            />
          </div>
          
          <div>
            <Label>Border Style</Label>
            <select
              value={currentStyle.borderStyle}
              onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm mt-1"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>

        {selectedNode?.type === 'process' && (
          <div>
            <Label>Border Radius</Label>
            <Input
              type="number"
              min="0"
              max="50"
              value={currentStyle.borderRadius}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value) || 0)}
              className="h-8 mt-1"
            />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Text</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={currentStyle.textColor}
                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-300"
              />
              <Input
                value={currentStyle.textColor}
                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label>Font Size</Label>
            <Input
              type="number"
              min="8"
              max="24"
              value={currentStyle.fontSize}
              onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 14)}
              className="h-8 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Icon & Effects */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Icon & Effects</h4>
        
        <div>
          <Label>Icon (Lucide name)</Label>
          <Input
            value={currentStyle.icon}
            onChange={(e) => handleStyleChange('icon', e.target.value)}
            placeholder="circle, play, zap, etc."
            className="h-8 mt-1"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Drop Shadow</Label>
          <Switch
            checked={currentStyle.shadow}
            onCheckedChange={(checked) => handleStyleChange('shadow', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderEdgeStyles = () => (
    <div className="space-y-6">
      {/* Stroke */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Stroke</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Stroke Color</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={currentStyle.strokeColor}
                onChange={(e) => handleStyleChange('strokeColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-300"
              />
              <Input
                value={currentStyle.strokeColor}
                onChange={(e) => handleStyleChange('strokeColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label>Stroke Width</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={currentStyle.strokeWidth}
              onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value) || 1)}
              className="h-8 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Style */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Style</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Edge Style</Label>
            <select
              value={currentStyle.style}
              onChange={(e) => handleStyleChange('style', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm mt-1"
            >
              <option value="bezier">Bezier</option>
              <option value="straight">Straight</option>
              <option value="step">Step</option>
              <option value="orthogonal">Orthogonal</option>
            </select>
          </div>
          
          <div>
            <Label>Arrow Head</Label>
            <select
              value={currentStyle.arrowHead}
              onChange={(e) => handleStyleChange('arrowHead', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm mt-1"
            >
              <option value="none">None</option>
              <option value="triangle">Triangle</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Dashed Line</Label>
          <Switch
            checked={currentStyle.dashed}
            onCheckedChange={(checked) => handleStyleChange('dashed', checked)}
          />
        </div>
      </div>

      {/* Label */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Label</h4>
        
        <div>
          <Label>Label Background</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={currentStyle.labelBgColor}
              onChange={(e) => handleStyleChange('labelBgColor', e.target.value)}
              className="w-8 h-8 rounded border border-slate-300"
            />
            <Input
              value={currentStyle.labelBgColor}
              onChange={(e) => handleStyleChange('labelBgColor', e.target.value)}
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>
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
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Format</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isNode ? 'Node styling options' : 'Edge styling options'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isNode ? renderNodeStyles() : renderEdgeStyles()}
        </div>
      </div>
    </>
  );
}