import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Workflow, PenTool, Users } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show navigation on whiteboard pages
  if (!location.pathname.includes('/whiteboard')) {
    return null;
  }

  return (
    <nav className="bg-white border-b px-6 py-3">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">HBMP Platform</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/builder')}
          >
            <Workflow className="w-4 h-4 mr-2" />
            Flow Builder
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/whiteboards')}
          >
            <PenTool className="w-4 h-4 mr-2" />
            Whiteboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/collaboration')}
          >
            <Users className="w-4 h-4 mr-2" />
            Collaboration Demo
          </Button>
        </div>
      </div>
    </nav>
  );
}