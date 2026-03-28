import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Search, Replace, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

interface SearchMatch {
  type: 'node' | 'edge';
  id: string;
  field: string;
  value: string;
  position?: { x: number; y: number };
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  onSelectItem: (id: string, type: 'node' | 'edge') => void;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onSelectItem,
  onUpdateNode,
  onUpdateEdge
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [replaceMode, setReplaceMode] = useState(false);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const searchItems = useCallback(() => {
    if (!searchTerm.trim()) {
      setMatches([]);
      return;
    }

    const newMatches: SearchMatch[] = [];
    const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

    // Search nodes
    nodes.forEach(node => {
      const label = caseSensitive ? (node.data.label || '') : (node.data.label || '').toLowerCase();
      const id = caseSensitive ? node.id : node.id.toLowerCase();
      
      if (label.includes(term)) {
        newMatches.push({
          type: 'node',
          id: node.id,
          field: 'label',
          value: node.data.label || '',
          position: node.position
        });
      }
      
      if (id.includes(term)) {
        newMatches.push({
          type: 'node',
          id: node.id,
          field: 'id',
          value: node.id,
          position: node.position
        });
      }
    });

    // Search edges
    edges.forEach(edge => {
      const label = caseSensitive ? (edge.label || '') : (edge.label || '').toLowerCase();
      const id = caseSensitive ? edge.id : edge.id.toLowerCase();
      
      if (label.includes(term)) {
        newMatches.push({
          type: 'edge',
          id: edge.id,
          field: 'label',
          value: edge.label || ''
        });
      }
      
      if (id.includes(term)) {
        newMatches.push({
          type: 'edge',
          id: edge.id,
          field: 'id',
          value: edge.id
        });
      }
    });

    setMatches(newMatches);
    setCurrentMatchIndex(0);
  }, [searchTerm, nodes, edges, caseSensitive]);

  useEffect(() => {
    searchItems();
  }, [searchItems]);

  const navigateMatch = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentMatchIndex >= matches.length - 1 ? 0 : currentMatchIndex + 1;
    } else {
      newIndex = currentMatchIndex <= 0 ? matches.length - 1 : currentMatchIndex - 1;
    }
    
    setCurrentMatchIndex(newIndex);
    
    const match = matches[newIndex];
    onSelectItem(match.id, match.type);
  };

  const replaceCurrentMatch = () => {
    if (matches.length === 0 || !replaceTerm) return;
    
    const match = matches[currentMatchIndex];
    const newValue = match.value.replace(
      new RegExp(searchTerm, caseSensitive ? 'g' : 'gi'),
      replaceTerm
    );
    
    if (match.type === 'node' && match.field === 'label') {
      onUpdateNode(match.id, { label: newValue });
    } else if (match.type === 'edge' && match.field === 'label') {
      onUpdateEdge(match.id, { label: newValue });
    }
    
    // Refresh search after replace
    setTimeout(searchItems, 100);
  };

  const replaceAll = () => {
    if (!searchTerm || !replaceTerm) return;
    
    let replacedCount = 0;
    
    // Replace in nodes
    nodes.forEach(node => {
      if (node.data.label && node.data.label.includes(searchTerm)) {
        const newLabel = node.data.label.replace(
          new RegExp(searchTerm, caseSensitive ? 'g' : 'gi'),
          replaceTerm
        );
        onUpdateNode(node.id, { label: newLabel });
        replacedCount++;
      }
    });
    
    // Replace in edges
    edges.forEach(edge => {
      if (edge.label && edge.label.includes(searchTerm)) {
        const newLabel = edge.label.replace(
          new RegExp(searchTerm, caseSensitive ? 'g' : 'gi'),
          replaceTerm
        );
        onUpdateEdge(edge.id, { label: newLabel });
        replacedCount++;
      }
    });
    
    // Refresh search after replace all
    setTimeout(searchItems, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        navigateMatch('prev');
      } else {
        navigateMatch('next');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentMatch = matches[currentMatchIndex];

  return (
    <>
      {/* Search Bar */}
      <div className="fixed top-20 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">
              {replaceMode ? 'Find & Replace' : 'Find'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplaceMode(!replaceMode)}
              className="h-6 px-2"
            >
              <Replace className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nodes and edges..."
              className="text-sm"
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMatch('prev')}
                disabled={matches.length === 0}
                className="h-8 px-2 rounded-r-none"
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMatch('next')}
                disabled={matches.length === 0}
                className="h-8 px-2 rounded-l-none border-l-0"
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {replaceMode && (
            <div className="flex gap-2">
              <Input
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Replace with..."
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={replaceCurrentMatch}
                disabled={matches.length === 0 || !replaceTerm}
                className="h-8 px-2"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={replaceAll}
                disabled={matches.length === 0 || !replaceTerm}
                className="h-8 px-3 text-xs"
              >
                All
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-3 h-3"
              />
              Case sensitive
            </label>
            <span>
              {matches.length > 0 
                ? `${currentMatchIndex + 1} of ${matches.length}`
                : searchTerm ? 'No matches' : ''
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      {matches.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-200 px-4 py-2 z-40">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-blue-700">
                Found {matches.length} matches for "{searchTerm}"
              </span>
              {currentMatch && (
                <span className="text-blue-600">
                  Current: {currentMatch.type} "{currentMatch.value}" 
                  {currentMatch.field === 'id' ? ' (ID)' : ' (Label)'}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMatches([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </>
  );
};