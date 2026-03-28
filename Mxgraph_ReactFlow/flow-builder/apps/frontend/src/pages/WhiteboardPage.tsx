import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { whiteboardsApi } from '../api/whiteboards';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Save, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createYjsProvider } from '../lib/collabProvider';
import * as Y from 'yjs';

interface WhiteboardData {
  elements: any[];
  appState: any;
}

export default function WhiteboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [whiteboardData, setWhiteboardData] = useState<WhiteboardData>({
    elements: [],
    appState: {}
  });
  const [whiteboardName, setWhiteboardName] = useState('Untitled Whiteboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ExcalidrawComponent, setExcalidrawComponent] = useState<any>(null);

  // Simplified collaboration setup
  useEffect(() => {
    const roomId = `whiteboard-${id || 'new'}`;
    const { destroy } = createYjsProvider(roomId, { id: 'guest', name: 'Guest', color: '#10b981' });
    return () => destroy();
  }, [id]);

  // Dynamically import Excalidraw
  useEffect(() => {
    const loadExcalidraw = async () => {
      try {
        const { Excalidraw } = await import('@excalidraw/excalidraw');
        setExcalidrawComponent(() => ({ Excalidraw }));
      } catch (error) {
        console.error('Failed to load Excalidraw:', error);
        toast.error('Failed to load whiteboard editor');
      }
    };
    loadExcalidraw();
  }, []);

  // Load whiteboard data
  useEffect(() => {
    const loadWhiteboard = async () => {
      if (!id || id === 'new') {
        setIsLoading(false);
        return;
      }

      try {
        const whiteboard = await whiteboardsApi.getById(id);
        const parsedData = JSON.parse(whiteboard.data);
        setWhiteboardData(parsedData);
        setWhiteboardName(whiteboard.name);
      } catch (error) {
        console.error('Failed to load whiteboard:', error);
        toast.error('Failed to load whiteboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadWhiteboard();
  }, [id]);

  const handleChange = useCallback((elements: any[], appState: any) => {
    setWhiteboardData({ elements, appState });
  }, []);

  const handleSave = async (isAutoSave = false) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const dataToSave = {
        name: whiteboardName,
        data: JSON.stringify(whiteboardData)
      };

      if (!id || id === 'new') {
        const newWhiteboard = await whiteboardsApi.create(dataToSave);
        navigate(`/whiteboard/${newWhiteboard.id}`, { replace: true });
        if (!isAutoSave) toast.success('Whiteboard created');
      } else {
        await whiteboardsApi.update(id, dataToSave);
        if (!isAutoSave) toast.success('Whiteboard saved');
      }
    } catch (error) {
      if (!isAutoSave) toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading whiteboard...</div>
      </div>
    );
  }

  if (!ExcalidrawComponent) {
    return (
      <div className="h-[calc(100vh-60px)] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/whiteboards')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Input
              value={whiteboardName}
              onChange={(e) => setWhiteboardName(e.target.value)}
              className="text-lg font-medium border-none shadow-none p-0 h-auto"
            />
          </div>
          <Button size="sm" onClick={() => handleSave()} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-xl font-medium mb-2">Whiteboard Editor</div>
            <div className="text-gray-600 mb-4">Excalidraw is loading...</div>
            <div className="text-sm text-gray-500">Please install @excalidraw/excalidraw to use the whiteboard</div>
          </div>
        </div>
      </div>
    );
  }

  const { Excalidraw } = ExcalidrawComponent;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/whiteboards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Input
            value={whiteboardName}
            onChange={(e) => setWhiteboardName(e.target.value)}
            className="text-lg font-medium border-none shadow-none p-0 h-auto"
          />
        </div>
        <Button size="sm" onClick={() => handleSave()} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="flex-1">
        <Excalidraw
          initialData={whiteboardData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}