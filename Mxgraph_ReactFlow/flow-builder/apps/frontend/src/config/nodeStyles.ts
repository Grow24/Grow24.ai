import { Play, Square, Zap, Settings, Circle, FileText, Database, ArrowRightLeft, StickyNote, Diamond, HelpCircle, Cog } from 'lucide-react';

export interface NodeStyleConfig {
  background: string;
  border: string;
  textColor: string;
  icon: React.ComponentType<any>;
  shape: 'rectangle' | 'oval' | 'diamond' | 'circle' | 'document';
  borderRadius?: number;
}

export const drawioNodeStyles: Record<string, NodeStyleConfig> = {
  start: {
    background: '#d4e6f1',
    border: '#5d6d7e',
    textColor: '#2c3e50',
    icon: Play,
    shape: 'oval'
  },
  end: {
    background: '#d4e6f1',
    border: '#5d6d7e',
    textColor: '#2c3e50',
    icon: Square,
    shape: 'oval'
  },
  process: {
    background: '#d5f4e6',
    border: '#52c41a',
    textColor: '#2c3e50',
    icon: Settings,
    shape: 'process'
  },
  activity: {
    background: '#d5f4e6',
    border: '#52c41a',
    textColor: '#2c3e50',
    icon: Cog,
    shape: 'process'
  },
  decision: {
    background: '#fff2cc',
    border: '#d6b656',
    textColor: '#2c3e50',
    icon: HelpCircle,
    shape: 'diamond'
  },
  action: {
    background: '#dae8fc',
    border: '#6c8ebf',
    textColor: '#2c3e50',
    icon: Zap,
    shape: 'rectangle'
  },
  document: {
    background: '#f8cecc',
    border: '#b85450',
    textColor: '#2c3e50',
    icon: FileText,
    shape: 'document'
  },
  database: {
    background: '#e1d5e7',
    border: '#9673a6',
    textColor: '#2c3e50',
    icon: Database,
    shape: 'rectangle'
  },
  inputoutput: {
    background: '#d5e8d4',
    border: '#82b366',
    textColor: '#2c3e50',
    icon: ArrowRightLeft,
    shape: 'rectangle'
  },
  connector: {
    background: '#f5f5f5',
    border: '#666666',
    textColor: '#2c3e50',
    icon: Circle,
    shape: 'circle'
  },
  annotation: {
    background: '#fff2cc',
    border: '#d6b656',
    textColor: '#2c3e50',
    icon: StickyNote,
    shape: 'rectangle'
  },
  stickynote: {
    background: '#fff2cc',
    border: '#d6b656',
    textColor: '#2c3e50',
    icon: StickyNote,
    shape: 'rectangle'
  },
  text: {
    background: '#ffffff',
    border: '#000000',
    textColor: '#2c3e50',
    icon: FileText,
    shape: 'rectangle'
  },
  callout: {
    background: '#ffe6cc',
    border: '#d79b00',
    textColor: '#2c3e50',
    icon: StickyNote,
    shape: 'rectangle'
  },
  image: {
    background: '#dae8fc',
    border: '#6c8ebf',
    textColor: '#2c3e50',
    icon: FileText,
    shape: 'rectangle'
  }
};

export const drawioBaseNodeClass = "font-medium text-[14px] leading-snug shadow-[0_1px_4px_rgba(0,0,0,0.15)] border-[2px] flex items-center justify-center w-[160px] h-[60px]";

export const drawioSpacing = {
  nodeWidth: 160,
  nodeHeight: 60,
  horizontalSpacing: 220,
  verticalSpacing: 100
};

export const drawioEdgeStyles = {
  default: {
    stroke: '#9CA3AF',
    strokeWidth: 2,
    strokeDasharray: 'none',
    markerEnd: {
      type: 'arrowclosed',
      color: '#2563EB',
      width: 8,
      height: 8
    }
  },
  active: {
    stroke: 'url(#activeGradient)',
    strokeWidth: 3,
    strokeDasharray: 'none',
    markerEnd: {
      type: 'arrowclosed',
      color: '#2563EB',
      width: 10,
      height: 10
    }
  },
  hover: {
    stroke: '#2563EB',
    strokeWidth: 3,
    filter: 'drop-shadow(0 0 4px #93C5FD)'
  }
};

export const drawioLabelStyles = {
  fontSize: '13px',
  fontFamily: 'Inter, Roboto, "Open Sans", sans-serif',
  fontWeight: 'bold',
  color: '#374151',
  backgroundColor: 'white',
  padding: '2px 6px',
  borderRadius: '6px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};