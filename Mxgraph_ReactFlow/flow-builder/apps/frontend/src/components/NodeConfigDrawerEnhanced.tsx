import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { X, Settings, Play, Zap, Square, Trash2, Copy, Paperclip } from 'lucide-react';
import { AttachmentTray } from './embed/AttachmentTray';
import { attachmentApi } from '../api/media';
import { ProceduralNodeConfig } from './ProceduralNodeConfigEnhanced';

interface NodeConfigDrawerProps {
  selectedNode: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
  onDelete?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
}

export function NodeConfigDrawer({ selectedNode, isOpen, onClose, onSave, onDelete, onDuplicate }: NodeConfigDrawerProps) {
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('properties');
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (selectedNode) {
      console.log('NodeConfigDrawer selectedNode changed:', {
        id: selectedNode.id,
        type: selectedNode.type,
        data: selectedNode.data,
        dataKeys: Object.keys(selectedNode.data || {}),
        hasConditions: !!(selectedNode.data?.conditions),
        conditionsLength: selectedNode.data?.conditions?.length || 0
      });
      setFormData(selectedNode.data || {});
      loadAttachments();
    }
  }, [selectedNode]);

  const loadAttachments = async () => {
    if (!selectedNode) return;
    try {
      const nodeAttachments = await attachmentApi.getByScope('flowNode', selectedNode.id);
      setAttachments(nodeAttachments);
    } catch (error) {
      console.error('Failed to load attachments:', error);
    }
  };

  if (!selectedNode || !isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(selectedNode.id, formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && selectedNode) {
      onDelete(selectedNode.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate && selectedNode) {
      onDuplicate(selectedNode.id);
      onClose();
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const getNodeIcon = () => {
    switch (selectedNode.type) {
      case 'start': return <Play className="w-5 h-5 text-green-600" />;
      case 'decision': return (
        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
        </svg>
      );
      case 'action': return <Zap className="w-5 h-5 text-blue-600" />;
      case 'process': return <Settings className="w-5 h-5 text-purple-600" />;
      case 'connector': return (
        <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
        </svg>
      );
      case 'end': return <Square className="w-5 h-5 text-red-600" />;
      case 'table': return <Settings className="w-5 h-5 text-emerald-600" />;
      default: return <Settings className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNodeColor = () => {
    switch (selectedNode.type) {
      case 'start': return 'from-green-500 to-green-600';
      case 'decision': return 'from-amber-500 to-amber-600';
      case 'action': return 'from-blue-500 to-blue-600';
      case 'process': return 'from-purple-500 to-purple-600';
      case 'connector': return 'from-slate-500 to-slate-600';
      case 'end': return 'from-red-500 to-red-600';
      case 'table': return 'from-emerald-500 to-emerald-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-slate-200 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getNodeColor()} flex items-center justify-center shadow-sm`}>
                <div className="text-white">{getNodeIcon()}</div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 capitalize">{selectedNode.type} Element</h2>
                <p className="text-sm text-slate-500">Configure element properties and behavior</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onDuplicate && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDuplicate}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  title="Duplicate element"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg"
                  title="Delete element"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('properties')}
              className={`py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'properties' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Properties
            </button>
            <button 
              onClick={() => setActiveTab('attachments')}
              className={`py-3 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${
                activeTab === 'attachments' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              Attachments
              {attachments.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                  {attachments.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'advanced' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {activeTab === 'properties' && (
              <>
                {/* Element Info Card */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded bg-gradient-to-br ${getNodeColor()} flex items-center justify-center`}>
                      <div className="text-white text-xs">{getNodeIcon()}</div>
                    </div>
                    <h3 className="font-medium text-slate-900 capitalize">{selectedNode.type} Element</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedNode.type === 'start' && 'Defines the entry point where the flow begins execution.'}
                    {selectedNode.type === 'decision' && 'Creates conditional branches based on data evaluation using MECE logic.'}
                    {selectedNode.type === 'action' && 'Performs operations like sending emails, API calls, or database updates.'}
                    {selectedNode.type === 'process' && 'Represents a business process or complex operation with multiple steps.'}
                    {selectedNode.type === 'connector' && 'Provides a junction point for organizing and connecting multiple flow paths.'}
                    {selectedNode.type === 'end' && 'Marks the completion point where the flow terminates.'}
                    {selectedNode.type === 'table' && 'Interactive data table with editable cells, resizable columns, and context menu operations.'}
                  </p>
                </div>

                {/* Enhanced Procedural Configuration */}
                <ProceduralNodeConfig
                  nodeType={selectedNode.type}
                  initialData={selectedNode.data || {}}
                  onSave={(data) => {
                    console.log('ProceduralNodeConfig onSave called with:', data);
                    setFormData(data);
                    // Immediately save to parent (FlowBuilder)
                    onSave(selectedNode.id, data);
                  }}
                />
              </>
            )}

            {activeTab === 'attachments' && selectedNode && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Paperclip className="w-5 h-5 text-slate-600" />
                    <h3 className="font-medium text-slate-900">Media Attachments</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Attach images, videos, documents, links, and rich text to this element for documentation and reference.
                  </p>
                </div>
                
                <AttachmentTray
                  scope="flowNode"
                  scopeId={selectedNode.id}
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                />
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-2">Advanced Settings</h3>
                  <p className="text-sm text-slate-600">
                    Advanced configuration options for this element.
                  </p>
                </div>
                <div className="text-center py-8 text-slate-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Advanced settings coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <div>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">Delete</kbd> to remove</div>
            </div>
            <div className="flex gap-3">
              {onDelete && (
                <Button 
                  variant="outline" 
                  onClick={handleDelete} 
                  className="px-4 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="px-4">
                Cancel
              </Button>
              <Button 
                onClick={onClose}
                className="px-4 bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}