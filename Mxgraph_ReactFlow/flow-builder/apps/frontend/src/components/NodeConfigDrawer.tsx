import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { X, Settings, Play, Zap, Square, Trash2, Copy, Paperclip } from 'lucide-react';
import { AttachmentTray } from './embed/AttachmentTray';
import { attachmentApi } from '../api/media';
import { ProceduralNodeConfigEnhanced } from './ProceduralNodeConfigEnhanced';
// Fixed import issues - cache refresh

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

  const renderNodeSpecificFields = () => {
    switch (selectedNode.type) {
      case 'start':
        return (
          <div className="space-y-8">
            {/* Basic Properties Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Basic Properties</h4>
              </div>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Display Label <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.label || ''}
                    onChange={(e) => updateFormData('label', e.target.value)}
                    placeholder="e.g., Customer Registration Start"
                    className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    This label appears on the flow canvas and in execution logs
                  </p>
                </div>
              </div>
            </div>

            {/* Flow Behavior Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Play className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Flow Behavior</h4>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <Play className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-green-900 mb-1">Entry Point</h5>
                    <p className="text-sm text-green-700">
                      This element serves as the starting point for flow execution. When the flow runs, 
                      processing begins here and follows the connected path.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'decision':
        return (
          <div className="space-y-8">
            {/* Basic Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Basic Properties</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Decision Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => updateFormData('label', e.target.value)}
                  placeholder="e.g., Customer Value Assessment"
                  className="h-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white"
                />
                <p className="text-xs text-slate-500 mt-2">Describe what this decision evaluates</p>
              </div>
            </div>

            {/* MECE Logic Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-slate-900">MECE Logic Configuration</h4>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-900 mb-1">MECE Validation</h5>
                    <p className="text-sm text-amber-700">
                      Conditions must be Mutually Exclusive (no overlaps) and Collectively Exhaustive (cover all cases).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Decision Conditions <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={JSON.stringify(formData.conditions || [], null, 2)}
                  onChange={(e) => {
                    try {
                      updateFormData('conditions', JSON.parse(e.target.value));
                    } catch {}
                  }}
                  placeholder='[\n  {\n    "id": "enterprise",\n    "label": "Enterprise Customer",\n    "expression": "revenue >= 1000000"\n  },\n  {\n    "id": "business",\n    "label": "Business Customer",\n    "expression": "revenue >= 100000 && revenue < 1000000"\n  }\n]'
                  rows={10}
                  className="border-slate-300 focus:border-amber-500 focus:ring-amber-500/20 font-mono text-sm bg-slate-50"
                />
                <div className="mt-2 flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-slate-600">
                    Each condition needs: <code className="bg-slate-200 px-1 rounded">id</code>, 
                    <code className="bg-slate-200 px-1 rounded">label</code>, and 
                    <code className="bg-slate-200 px-1 rounded">expression</code>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Default Path <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.defaultPath || ''}
                  onChange={(e) => updateFormData('defaultPath', e.target.value)}
                  placeholder="default"
                  className="h-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Fallback path when no conditions match (ensures completeness)
                </p>
              </div>
            </div>
          </div>
        );

      case 'activity':
        const actions = formData.actions || [];
        
        const addAction = () => {
          const newAction = { type: 'email', config: {} };
          updateFormData('actions', [...actions, newAction]);
        };
        
        const removeAction = (index: number) => {
          updateFormData('actions', actions.filter((_: any, i: number) => i !== index));
        };
        
        const updateAction = (index: number, field: string, value: any) => {
          const updatedActions = [...actions];
          updatedActions[index] = { ...updatedActions[index], [field]: value };
          updateFormData('actions', updatedActions);
        };
        
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Activity Properties</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Activity Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => updateFormData('label', e.target.value)}
                  placeholder="e.g., Customer Onboarding"
                  className="h-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-500" />
                  <h4 className="font-semibold text-slate-900">Actions ({actions.length})</h4>
                </div>
                <Button onClick={addAction} size="sm" className="gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Action
                </Button>
              </div>
              
              {actions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No actions configured</p>
                  <p className="text-xs">Click "Add Action" to get started</p>
                </div>
              )}
              
              {actions.map((action: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Action {index + 1}</span>
                    <Button 
                      onClick={() => removeAction(index)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select
                      value={action.type || 'email'}
                      onChange={(e) => updateAction(index, 'type', e.target.value)}
                      className="w-full h-8 px-2 py-1 border border-slate-300 rounded text-sm"
                    >
                      <option value="email">📧 Email</option>
                      <option value="api">🌐 API Call</option>
                      <option value="db">🗄️ Database</option>
                      <option value="webhook">⚡ Webhook</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Configuration</label>
                    <Textarea
                      value={JSON.stringify(action.config || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          updateAction(index, 'config', JSON.parse(e.target.value));
                        } catch {}
                      }}
                      rows={3}
                      className="text-xs font-mono"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'action':
        const getActionTypeIcon = (type: string) => {
          switch (type) {
            case 'email': return '📧';
            case 'api': return '🌐';
            case 'db': return '🗄️';
            default: return '⚡';
          }
        };
        
        const getActionTypeDescription = (type: string) => {
          switch (type) {
            case 'email': return 'Send automated email notifications to users or stakeholders';
            case 'api': return 'Make HTTP requests to external services or internal APIs';
            case 'db': return 'Perform database operations like create, read, update, or delete';
            default: return 'Select an action type to see description';
          }
        };
        
        return (
          <div className="space-y-8">
            {/* Basic Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Basic Properties</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => updateFormData('label', e.target.value)}
                  placeholder="e.g., Send Welcome Email"
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                />
                <p className="text-xs text-slate-500 mt-2">Describe what this action accomplishes</p>
              </div>
            </div>

            {/* Action Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Zap className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Action Configuration</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.actionType || 'email'}
                  onChange={(e) => updateFormData('actionType', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500/20 bg-white text-sm"
                >
                  <option value="email">📧 Email Notification</option>
                  <option value="api">🌐 API Integration</option>
                  <option value="db">🗄️ Database Operation</option>
                </select>
                
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getActionTypeIcon(formData.actionType || 'email')}</span>
                    <div>
                      <h5 className="font-medium text-blue-900 text-sm">
                        {formData.actionType === 'email' && 'Email Notification'}
                        {formData.actionType === 'api' && 'API Integration'}
                        {formData.actionType === 'db' && 'Database Operation'}
                      </h5>
                      <p className="text-xs text-blue-700 mt-1">
                        {getActionTypeDescription(formData.actionType || 'email')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Configuration Parameters
                </label>
                <Textarea
                  value={JSON.stringify(formData.config || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      updateFormData('config', JSON.parse(e.target.value));
                    } catch {}
                  }}
                  placeholder={`{\n  ${formData.actionType === 'email' ? '"to": "{{customerEmail}}",\n  "subject": "Welcome to our platform",\n  "template": "welcome_email"' : formData.actionType === 'api' ? '"endpoint": "https://api.example.com/users",\n  "method": "POST",\n  "headers": {"Authorization": "Bearer {{token}}"}' : '"operation": "insert",\n  "table": "customers",\n  "data": {"name": "{{customerName}}"}'}\n}`}
                  rows={8}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 font-mono text-sm bg-slate-50"
                />
                <div className="mt-2 flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-slate-600">
                    Use <code className="bg-slate-200 px-1 rounded">{'{{variableName}}'}</code> for dynamic values from flow context
                  </p>
                </div>
              </div>
            </div>

            {/* Output Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-slate-900">Output Configuration</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Output Variable Name
                </label>
                <Input
                  value={formData.outputVar || ''}
                  onChange={(e) => updateFormData('outputVar', e.target.value)}
                  placeholder="actionResult"
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Variable name to store the action result for use in subsequent elements
                </p>
              </div>
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-8">
            {/* Basic Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Basic Properties</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Process Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => updateFormData('label', e.target.value)}
                  placeholder="e.g., Customer Validation Process"
                  className="h-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe the business process..."
                  rows={3}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                />
              </div>
            </div>
          </div>
        );

      case 'connector':
        return (
          <div className="space-y-8">
            {/* Basic Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Settings className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-900">Basic Properties</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Connector Label
                </label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => updateFormData('label', e.target.value)}
                  placeholder="e.g., Junction Point"
                  className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20 bg-white"
                />
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-slate-900 mb-1">Connection Point</h5>
                  <p className="text-sm text-slate-700">
                    Connectors help organize complex flows by providing junction points for multiple paths.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'end':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Node Label</label>
              <Input
                value={formData.label || ''}
                onChange={(e) => updateFormData('label', e.target.value)}
                placeholder="Enter completion message"
                className="border-slate-300 focus:border-red-500 focus:ring-red-500"
              />
              <p className="text-xs text-slate-500 mt-1">Message shown when flow completes</p>
            </div>
          </div>
        );

      default:
        return null;
    }
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
                  </p>
                </div>

                {/* Procedural Configuration */}
                {['start', 'decision', 'action', 'process', 'end', 'table'].includes(selectedNode.type) ? (
                  <ProceduralNodeConfigEnhanced
                    nodeType={selectedNode.type}
                    initialData={selectedNode.data || {}}
                    onSave={(data) => {
                      console.log('ProceduralNodeConfigEnhanced onSave called with:', data);
                      setFormData(data);
                      // Immediately save to parent (FlowBuilder)
                      onSave(selectedNode.id, data);
                    }}
                  />
                ) : (
                  <div className="space-y-6">
                    {renderNodeSpecificFields()}
                  </div>
                )}
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
                onClick={() => {
                  // For procedural config, save the current formData
                  if (['start', 'decision', 'action', 'process', 'end', 'table'].includes(selectedNode.type)) {
                    onSave(selectedNode.id, formData);
                  } else {
                    handleSave();
                  }
                  onClose();
                }} 
                className="px-4 bg-blue-600 hover:bg-blue-700"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}