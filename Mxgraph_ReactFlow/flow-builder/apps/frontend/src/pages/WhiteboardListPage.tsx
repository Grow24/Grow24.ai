import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { whiteboardsApi, WhiteboardListItem } from '../api/whiteboards';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WhiteboardListPage() {
  const navigate = useNavigate();
  const [whiteboards, setWhiteboards] = useState<WhiteboardListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWhiteboards();
  }, []);

  const loadWhiteboards = async () => {
    try {
      const data = await whiteboardsApi.getAll();
      setWhiteboards(data);
    } catch (error) {
      console.error('Failed to load whiteboards:', error);
      toast.error('Failed to load whiteboards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await whiteboardsApi.delete(id);
      setWhiteboards(prev => prev.filter(wb => wb.id !== id));
      toast.success('Whiteboard deleted successfully');
    } catch (error) {
      console.error('Failed to delete whiteboard:', error);
      toast.error('Failed to delete whiteboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading whiteboards...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Whiteboards</h1>
          <p className="text-gray-600 mt-2">Create and manage your visual workspaces</p>
        </div>
        <Button onClick={() => navigate('/whiteboard/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Whiteboard
        </Button>
      </div>

      {whiteboards.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No whiteboards yet</h3>
          <p className="text-gray-600 mb-6">Create your first whiteboard to get started</p>
          <Button onClick={() => navigate('/whiteboard/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Whiteboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {whiteboards.map((whiteboard) => (
            <Card
              key={whiteboard.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/whiteboard/${whiteboard.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {whiteboard.name}
                  </h3>
                  {whiteboard.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {whiteboard.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(whiteboard.id, whiteboard.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>Created: {formatDate(whiteboard.createdAt)}</div>
                <div>Updated: {formatDate(whiteboard.updatedAt)}</div>
                <div>Version: {whiteboard.version}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}