import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X, Play } from 'lucide-react';

interface FlowInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (inputData: any) => void;
  flowName: string;
}

export function FlowInputModal({ isOpen, onClose, onRun, flowName }: FlowInputModalProps) {
  const [inputText, setInputText] = useState('{\n  "creditScore": 750,\n  "amount": 1500,\n  "customerName": "John Doe"\n}');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRun = () => {
    try {
      const inputData = JSON.parse(inputText);
      setError('');
      onRun(inputData);
      onClose();
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Run Flow</h2>
              <p className="text-sm text-slate-500">{flowName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Input Data (JSON)
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='{\n  "variable1": "value1",\n  "variable2": 123\n}'
                rows={8}
                className="font-mono text-sm"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">Input Data Tips</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Enter variables used in your decision conditions</li>
                    <li>• Use valid JSON format with quotes around strings</li>
                    <li>• Numbers don't need quotes: "age": 25</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleRun} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Run Flow
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}