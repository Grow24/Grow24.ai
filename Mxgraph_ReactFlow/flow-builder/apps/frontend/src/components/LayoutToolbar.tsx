import React, { useState } from 'react';
import { Button } from './ui/button';
import { Layout, ChevronDown, Compass, Grid, Maximize2 } from 'lucide-react';
import { getLayoutStyles } from '../utils/layout';

interface LayoutToolbarProps {
  currentLayout: string;
  onLayoutChange: (layout: 'standard' | 'compact' | 'freeform') => void;
  onAutoLayout: () => void;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  currentLayout,
  onLayoutChange,
  onAutoLayout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutStyles = getLayoutStyles();

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'standard':
        return <Compass className="w-4 h-4" />;
      case 'compact':
        return <Grid className="w-4 h-4" />;
      case 'freeform':
        return <Maximize2 className="w-4 h-4" />;
      default:
        return <Layout className="w-4 h-4" />;
    }
  };

  const getLayoutLabel = (layout: string) => {
    switch (layout) {
      case 'standard':
        return 'Standard (Draw.io)';
      case 'compact':
        return 'Compact';
      case 'freeform':
        return 'Freeform';
      default:
        return 'Layout Style';
    }
  };

  return (
    <div className="relative flex items-center gap-0.5">
      <Button
        onClick={onAutoLayout}
        variant="ghost"
        size="sm"
        className="gap-1.5 h-7 px-2.5 text-xs font-medium hover:bg-white hover:shadow-sm transition-all"
        title="Auto Layout (Apply current style)"
      >
        <Layout className="w-3.5 h-3.5" />
        Auto
      </Button>
      
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="sm"
          className="gap-1 h-7 px-2.5 text-xs font-medium hover:bg-white hover:shadow-sm transition-all"
          title="Choose layout style"
        >
          {getLayoutIcon(currentLayout)}
          <ChevronDown className="w-3 h-3" />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-lg z-50">
            <div className="py-2">
              {layoutStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    onLayoutChange(style);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50/80 flex items-center gap-3 transition-all ${
                    currentLayout === style ? 'bg-blue-50/80 text-blue-700' : ''
                  }`}
                >
                  {getLayoutIcon(style)}
                  <div>
                    <div className="font-medium">{getLayoutLabel(style)}</div>
                    <div className="text-xs text-gray-500">
                      {style === 'standard' && 'Clean flowchart layout'}
                      {style === 'compact' && 'Tight spacing, minimal'}
                      {style === 'freeform' && 'Loose spacing, creative'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};