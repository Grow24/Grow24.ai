import { Node, Edge } from '@xyflow/react';

export const createRandomWordFlow = (): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 150 },
      data: {
        label: 'Start Generator',
        style: {
          fillColor: '#10b981',
          borderColor: '#059669',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'play'
        }
      }
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 300, y: 150 },
      data: {
        label: 'Category Type?',
        conditions: [
          { id: 'animals', condition: 'category === "animals"', label: 'Animals' },
          { id: 'colors', condition: 'category === "colors"', label: 'Colors' },
          { id: 'food', condition: 'category === "food"', label: 'Food' }
        ],
        defaultPath: 'Random',
        style: {
          fillColor: '#f59e0b',
          borderColor: '#d97706',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'diamond'
        }
      }
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 500, y: 50 },
      data: {
        label: 'Generate Animal',
        actionType: 'api',
        style: {
          fillColor: '#3b82f6',
          borderColor: '#2563eb',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'zap'
        }
      }
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 500, y: 150 },
      data: {
        label: 'Generate Color',
        actionType: 'api',
        style: {
          fillColor: '#8b5cf6',
          borderColor: '#7c3aed',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'zap'
        }
      }
    },
    {
      id: 'action-3',
      type: 'action',
      position: { x: 500, y: 250 },
      data: {
        label: 'Generate Food',
        actionType: 'api',
        style: {
          fillColor: '#f97316',
          borderColor: '#ea580c',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'zap'
        }
      }
    },
    {
      id: 'action-4',
      type: 'action',
      position: { x: 500, y: 350 },
      data: {
        label: 'Generate Random',
        actionType: 'api',
        style: {
          fillColor: '#6b7280',
          borderColor: '#4b5563',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'zap'
        }
      }
    },
    {
      id: 'decision-2',
      type: 'decision',
      position: { x: 700, y: 200 },
      data: {
        label: 'Length OK?',
        conditions: [
          { id: 'valid', condition: 'word.length >= minLength && word.length <= maxLength', label: 'Valid' },
          { id: 'invalid', condition: 'word.length < minLength || word.length > maxLength', label: 'Too Short/Long' }
        ],
        defaultPath: 'Valid',
        style: {
          fillColor: '#ec4899',
          borderColor: '#db2777',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'diamond'
        }
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 900, y: 200 },
      data: {
        label: 'Return Word',
        style: {
          fillColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'square'
        }
      }
    }
  ];

  const edges: Edge[] = [
    {
      id: 'e1',
      source: 'start-1',
      target: 'decision-1',
      label: 'Begin',
      type: 'animated'
    },
    {
      id: 'e2',
      source: 'decision-1',
      sourceHandle: 'animals',
      target: 'action-1',
      label: 'Animals',
      type: 'animated'
    },
    {
      id: 'e3',
      source: 'decision-1',
      sourceHandle: 'colors',
      target: 'action-2',
      label: 'Colors',
      type: 'animated'
    },
    {
      id: 'e4',
      source: 'decision-1',
      sourceHandle: 'food',
      target: 'action-3',
      label: 'Food',
      type: 'animated'
    },
    {
      id: 'e5',
      source: 'decision-1',
      sourceHandle: 'default',
      target: 'action-4',
      label: 'Random',
      type: 'animated'
    },
    {
      id: 'e6',
      source: 'action-1',
      target: 'decision-2',
      label: 'Check',
      type: 'animated'
    },
    {
      id: 'e7',
      source: 'action-2',
      target: 'decision-2',
      label: 'Check',
      type: 'animated'
    },
    {
      id: 'e8',
      source: 'action-3',
      target: 'decision-2',
      label: 'Check',
      type: 'animated'
    },
    {
      id: 'e9',
      source: 'action-4',
      target: 'decision-2',
      label: 'Check',
      type: 'animated'
    },
    {
      id: 'e10',
      source: 'decision-2',
      sourceHandle: 'valid',
      target: 'end-1',
      label: 'Valid Length',
      type: 'animated'
    },
    {
      id: 'e11',
      source: 'decision-2',
      sourceHandle: 'invalid',
      target: 'decision-1',
      label: 'Retry',
      type: 'animated'
    }
  ];

  return { nodes, edges };
};