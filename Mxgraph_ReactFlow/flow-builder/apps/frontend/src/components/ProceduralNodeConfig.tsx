import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Trash2, Plus, HelpCircle } from 'lucide-react';
import { NodeConfig, DecisionNodeConfig, ActionNodeConfig } from '../schemas/nodeSchemas';
import { validateNodeConfig, validateMECEConditions } from '../validators/nodeValidators';
import { mapJSONToConfig, mapConfigToJSON } from '../mappers/configMapper';

interface ProceduralNodeConfigProps {
  nodeType: string;
  initialData: any;
  onSave: (data: any) => void;
  onEdgeSync?: (conditions: Array<{ id: string; label: string }>) => void;
}

export function ProceduralNodeConfig({ nodeType, initialData, onSave, onEdgeSync }: ProceduralNodeConfigProps) {
  const [config, setConfig] = useState<NodeConfig>(() => {
    console.log('🎆 ProceduralNodeConfig initializing with:', { 
      nodeType, 
      initialData, 
      keys: Object.keys(initialData || {}),
      hasConditions: !!(initialData?.conditions),
      hasLabel: !!(initialData?.label)
    });
    const mappedConfig = mapJSONToConfig(nodeType, initialData);
    console.log('📋 Initial mapped config:', {
      type: mappedConfig.type,
      label: mappedConfig.label,
      conditions: (mappedConfig as any).conditions,
      hasConditions: !!((mappedConfig as any).conditions?.length)
    });
    return mappedConfig;
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log('🔄 ProceduralNodeConfig updating with:', { 
      nodeType, 
      initialData,
      keys: Object.keys(initialData || {}),
      hasConditions: !!(initialData?.conditions),
      conditionsLength: initialData?.conditions?.length || 0
    });
    const mappedConfig = mapJSONToConfig(nodeType, initialData);
    console.log('📋 Mapped config result:', {
      type: mappedConfig.type,
      label: mappedConfig.label,
      conditions: (mappedConfig as any).conditions,
      conditionsCount: ((mappedConfig as any).conditions?.length || 0)
    });
    setConfig(mappedConfig);
    console.log('✅ Config state updated');
  }, [nodeType, initialData]);

  const handleSave = () => {
    const validation = validateNodeConfig(config);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Additional MECE validation for decision nodes
    if (config.type === 'decision') {
      const meceValidation = validateMECEConditions(config.conditions);
      if (!meceValidation.isValid) {
        setErrors(meceValidation.errors);
        return;
      }
    }

    setErrors([]);
    
    // Sync edge labels for decision nodes
    if (config.type === 'decision' && onEdgeSync) {
      onEdgeSync(config.conditions);
    }
    
    const jsonData = mapConfigToJSON(config);
    console.log('💾 Saving config to parent:', jsonData);
    onSave(jsonData);
    console.log('✅ Config saved successfully');
  };

  const updateConfig = (updates: Partial<NodeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const renderStartConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Display Label *</label>
        <Input
          value={config.label}
          onChange={(e) => updateConfig({ label: e.target.value })}
          placeholder="e.g., Customer Registration Start"
        />
      </div>
    </div>
  );

  const renderDecisionConfig = () => {
    const decisionConfig = config as DecisionNodeConfig;
    
    const addCondition = () => {
      const newCondition = {
        id: `condition_${Date.now()}`,
        label: '',
        expression: ''
      };
      updateConfig({
        conditions: [...decisionConfig.conditions, newCondition]
      });
    };

    const updateCondition = (index: number, field: string, value: string) => {
      const updatedConditions = [...decisionConfig.conditions];
      updatedConditions[index] = { ...updatedConditions[index], [field]: value };
      updateConfig({ conditions: updatedConditions });
    };

    const removeCondition = (index: number) => {
      updateConfig({
        conditions: decisionConfig.conditions.filter((_, i) => i !== index)
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Decision Question *</label>
          <Input
            value={config.label}
            onChange={(e) => updateConfig({ label: e.target.value })}
            placeholder="What should we evaluate?"
          />
          <p className="text-xs text-slate-500 mt-1">Describe the decision being made</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Decision Logic (MECE)</h4>
              <p className="text-xs text-amber-700 mt-1">
                Conditions must be Mutually Exclusive (no overlaps) and Collectively Exhaustive (cover all cases)
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">When should each path be taken? *</label>
            <Button onClick={addCondition} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Path
            </Button>
          </div>
          
          {decisionConfig.conditions.map((condition, index) => (
            <div key={condition.id} className="border rounded-lg p-4 space-y-3 mb-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Path {index + 1}</span>
                <Button
                  onClick={() => removeCondition(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Path Name *</label>
                <Input
                  value={condition.label}
                  onChange={(e) => updateCondition(index, 'label', e.target.value)}
                  placeholder="e.g., High Value Customer"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">When to take this path *</label>
                <Input
                  value={condition.expression}
                  onChange={(e) => updateCondition(index, 'expression', e.target.value)}
                  placeholder="revenue >= 100000"
                  className="text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use variables like: revenue, customerType, accountAge
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Path ID</label>
                <Input
                  value={condition.id}
                  onChange={(e) => updateCondition(index, 'id', e.target.value)}
                  placeholder="high_value"
                  className="text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Path (when no conditions match) *</label>
          <Input
            value={decisionConfig.defaultPath}
            onChange={(e) => updateConfig({ defaultPath: e.target.value })}
            placeholder="standard_process"
            className="font-mono"
          />
          <p className="text-xs text-slate-500 mt-1">Fallback path to ensure all cases are covered</p>
        </div>
      </div>
    );
  };

  const renderActionConfig = () => {
    const actionConfig = config as ActionNodeConfig;
    const actionType = actionConfig.actionType || 'email';
    const actionConfigData = actionConfig.config || {};

    const updateActionConfig = (key: string, value: any) => {
      updateConfig({ 
        config: { ...actionConfigData, [key]: value }
      });
    };

    const renderEmailConfig = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">To Email *</label>
            <Input
              value={actionConfigData.to || ''}
              onChange={(e) => updateActionConfig('to', e.target.value)}
              placeholder="{{customerEmail}}"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">From Email</label>
            <Input
              value={actionConfigData.from || ''}
              onChange={(e) => updateActionConfig('from', e.target.value)}
              placeholder="noreply@company.com"
              className="text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Subject *</label>
          <Input
            value={actionConfigData.subject || ''}
            onChange={(e) => updateActionConfig('subject', e.target.value)}
            placeholder="Welcome to our platform, {{customerName}}!"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Email Template</label>
          <select
            value={actionConfigData.template || 'welcome'}
            onChange={(e) => updateActionConfig('template', e.target.value)}
            className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
          >
            <option value="welcome">Welcome Email</option>
            <option value="approval">Approval Notification</option>
            <option value="rejection">Rejection Notice</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>
      </div>
    );

    const renderApiConfig = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">HTTP Method *</label>
            <select
              value={actionConfigData.method || 'POST'}
              onChange={(e) => updateActionConfig('method', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Content Type</label>
            <select
              value={actionConfigData.contentType || 'application/json'}
              onChange={(e) => updateActionConfig('contentType', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
            >
              <option value="application/json">JSON</option>
              <option value="application/x-www-form-urlencoded">Form Data</option>
              <option value="text/plain">Plain Text</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">API Endpoint *</label>
          <Input
            value={actionConfigData.endpoint || ''}
            onChange={(e) => updateActionConfig('endpoint', e.target.value)}
            placeholder="https://api.example.com/users"
            className="text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Request Body</label>
          <Textarea
            value={JSON.stringify(actionConfigData.data || {}, null, 2)}
            onChange={(e) => {
              try {
                updateActionConfig('data', JSON.parse(e.target.value));
              } catch {}
            }}
            rows={4}
            className="text-xs font-mono"
            placeholder='{"name": "{{customerName}}", "email": "{{customerEmail}}"}'
          />
        </div>
      </div>
    );

    const renderDbConfig = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Operation *</label>
            <select
              value={actionConfigData.operation || 'insert'}
              onChange={(e) => updateActionConfig('operation', e.target.value)}
              className="w-full h-8 px-2 border border-slate-300 rounded text-sm"
            >
              <option value="insert">Insert Record</option>
              <option value="update">Update Record</option>
              <option value="delete">Delete Record</option>
              <option value="select">Query Records</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Table/Collection *</label>
            <Input
              value={actionConfigData.table || ''}
              onChange={(e) => updateActionConfig('table', e.target.value)}
              placeholder="customers"
              className="text-sm font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Data/Conditions</label>
          <Textarea
            value={JSON.stringify(actionConfigData.data || {}, null, 2)}
            onChange={(e) => {
              try {
                updateActionConfig('data', JSON.parse(e.target.value));
              } catch {}
            }}
            rows={4}
            className="text-xs font-mono"
            placeholder='{"name": "{{customerName}}", "status": "active"}'
          />
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">What should this action do? *</label>
          <Input
            value={config.label}
            onChange={(e) => updateConfig({ label: e.target.value })}
            placeholder="e.g., Send welcome email to new customer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Action Type *</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'email', label: 'Email', icon: '📧', desc: 'Send notifications' },
              { value: 'api', label: 'API Call', icon: '🌐', desc: 'External service' },
              { value: 'db', label: 'Database', icon: '🗄️', desc: 'Store/retrieve data' }
            ].map(type => (
              <button
                key={type.value}
                onClick={() => updateConfig({ actionType: type.value as any })}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  actionType === type.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-900' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-lg mb-1">{type.icon}</div>
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-slate-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-slate-50">
          <h4 className="font-medium text-sm mb-3 text-slate-700">
            {actionType === 'email' && '📧 Email Configuration'}
            {actionType === 'api' && '🌐 API Configuration'}
            {actionType === 'db' && '🗄️ Database Configuration'}
          </h4>
          {actionType === 'email' && renderEmailConfig()}
          {actionType === 'api' && renderApiConfig()}
          {actionType === 'db' && renderDbConfig()}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Save Result As (Optional)</label>
          <Input
            value={actionConfig.outputVar || ''}
            onChange={(e) => updateConfig({ outputVar: e.target.value })}
            placeholder="emailResult"
            className="font-mono"
          />
          <p className="text-xs text-slate-500 mt-1">
            Variable name to store the action result for use in later steps
          </p>
        </div>
      </div>
    );
  };

  const renderProcessConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Process Label *</label>
        <Input
          value={config.label}
          onChange={(e) => updateConfig({ label: e.target.value })}
          placeholder="e.g., Customer Validation Process"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={(config as any).description || ''}
          onChange={(e) => updateConfig({ description: e.target.value })}
          placeholder="Describe the business process..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderEndConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Completion Label *</label>
        <Input
          value={config.label}
          onChange={(e) => updateConfig({ label: e.target.value })}
          placeholder="e.g., Process Complete"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={(config as any).status || 'success'}
          onChange={(e) => updateConfig({ status: e.target.value as any })}
          className="w-full h-10 px-3 border border-slate-300 rounded-lg"
        >
          <option value="success">✅ Success</option>
          <option value="error">❌ Error</option>
        </select>
      </div>
    </div>
  );

  const renderConfigForm = () => {
    switch (nodeType) {
      case 'start': return renderStartConfig();
      case 'decision': return renderDecisionConfig();
      case 'action': return renderActionConfig();
      case 'process': return renderProcessConfig();
      case 'end': return renderEndConfig();
      default: return <div>Unsupported node type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {renderConfigForm()}

      <div className="pt-4 border-t">
        <Button onClick={handleSave} className="w-full">
          Apply Configuration
        </Button>
      </div>
    </div>
  );
}