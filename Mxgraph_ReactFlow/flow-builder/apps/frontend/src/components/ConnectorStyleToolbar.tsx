import React from 'react';
import { Button } from './ui/button';
import { ChevronDown, Minus, CornerDownRight, Waves, Zap } from 'lucide-react';

interface ConnectorStyleToolbarProps {
  currentStyle: 'straight' | 'elbow' | 'rounded' | 'smooth';
  onStyleChange: (style: 'straight' | 'elbow' | 'rounded' | 'smooth') => void;
}

export const ConnectorStyleToolbar: React.FC<ConnectorStyleToolbarProps> = ({
  currentStyle,
  onStyleChange
}) => {
  const styles = [
    { id: 'straight', label: 'Straight', icon: Minus },
    { id: 'elbow', label: 'Elbow', icon: CornerDownRight },
    { id: 'rounded', label: 'Rounded', icon: Waves },
    { id: 'smooth', label: 'Smooth', icon: Zap }
  ];

  const currentStyleData = styles.find(s => s.id === currentStyle);
  const CurrentIcon = currentStyleData?.icon || Minus;

  return (
    <div className="flex items-center gap-0.5">
      {styles.map((style) => {
        const Icon = style.icon;
        return (
          <Button
            key={style.id}
            variant={currentStyle === style.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onStyleChange(style.id as any)}
            className={`h-7 w-7 p-0 transition-all ${
              currentStyle === style.id 
                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                : 'hover:bg-white hover:shadow-sm'
            }`}
            title={`${style.label} Connector`}
          >
            <Icon className="w-3.5 h-3.5" />
          </Button>
        );
      })}
    </div>
  );
};