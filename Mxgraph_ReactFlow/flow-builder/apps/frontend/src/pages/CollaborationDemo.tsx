import React, { useState } from 'react';
import { CollabUser } from '../hooks/useCollaboration';
import { CollaborativeWhiteboard } from '../components/collaboration/CollaborativeWhiteboard';
import { CollaborativeDocs } from '../components/collaboration/CollaborativeDocs';
import { Button } from '../components/ui/button';
import { Users, FileText, PenTool, Workflow } from 'lucide-react';

const DEMO_USER: CollabUser = {
  id: 'user-' + Math.random().toString(36).substr(2, 9),
  name: `User ${Math.floor(Math.random() * 100)}`,
  color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
};

export const CollaborationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'whiteboard' | 'docs'>('flow');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Real-Time Collaboration Demo</h1>
            <p className="text-gray-600">Experience enterprise-grade collaborative editing</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {DEMO_USER.name} ({DEMO_USER.id.slice(-4)})
            </span>
            <div 
              className="w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: DEMO_USER.color }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'flow'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Flow Builder
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'whiteboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Whiteboard
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'docs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'flow' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Flow Builder Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Real-time collaborative flow editing is integrated into the main Flow Builder.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Open Flow Builder
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === 'whiteboard' && (
          <CollaborativeWhiteboard
            whiteboardId="demo-whiteboard"
            currentUser={DEMO_USER}
          />
        )}
        
        {activeTab === 'docs' && (
          <CollaborativeDocs
            docId="demo-doc"
            currentUser={DEMO_USER}
          />
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-sm text-blue-700">
            <strong>Try it:</strong> Open this page in multiple browser tabs or share the URL with others to see real-time collaboration in action!
          </p>
        </div>
      </div>
    </div>
  );
};