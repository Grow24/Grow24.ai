import { Node, Edge } from '@xyflow/react';

export const createBrainstormingFlow = (): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 400, y: 50 },
      data: {
        label: 'Begin Brainstorming',
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
      id: 'action-1',
      type: 'action',
      position: { x: 400, y: 150 },
      data: {
        label: 'Generate Random Word',
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
      id: 'process-1',
      type: 'process',
      position: { x: 400, y: 250 },
      data: {
        label: 'Present Word to Team',
        description: 'Display random word for brainstorming',
        style: {
          fillColor: '#8b5cf6',
          borderColor: '#7c3aed',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'users'
        }
      }
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 400, y: 350 },
      data: {
        label: 'Collect Ideas',
        actionType: 'db',
        style: {
          fillColor: '#f59e0b',
          borderColor: '#d97706',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'lightbulb'
        }
      }
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 400, y: 450 },
      data: {
        label: 'More Ideas Needed?',
        conditions: [
          { id: 'yes', condition: 'ideaCount < targetCount', label: 'Yes' },
          { id: 'no', condition: 'ideaCount >= targetCount', label: 'No' }
        ],
        defaultPath: 'No',
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
      id: 'action-3',
      type: 'action',
      position: { x: 200, y: 550 },
      data: {
        label: 'Generate New Word',
        actionType: 'api',
        style: {
          fillColor: '#06b6d4',
          borderColor: '#0891b2',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'refresh-cw'
        }
      }
    },
    {
      id: 'process-2',
      type: 'process',
      position: { x: 400, y: 550 },
      data: {
        label: 'Categorize Ideas',
        description: 'Group related concepts',
        style: {
          fillColor: '#84cc16',
          borderColor: '#65a30d',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'folder'
        }
      }
    },
    {
      id: 'action-4',
      type: 'action',
      position: { x: 400, y: 650 },
      data: {
        label: 'Prioritize Concepts',
        actionType: 'db',
        style: {
          fillColor: '#f97316',
          borderColor: '#ea580c',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'star'
        }
      }
    },
    {
      id: 'process-3',
      type: 'process',
      position: { x: 400, y: 750 },
      data: {
        label: 'Document Results',
        description: 'Save brainstorming session',
        style: {
          fillColor: '#6366f1',
          borderColor: '#4f46e5',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'file-text'
        }
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 400, y: 850 },
      data: {
        label: 'Session Complete',
        style: {
          fillColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'check-circle'
        }
      }
    }
  ];

  const edges: Edge[] = [
    {
      id: 'e1',
      source: 'start-1',
      target: 'action-1',
      label: 'Start',
      type: 'animated'
    },
    {
      id: 'e2',
      source: 'action-1',
      target: 'process-1',
      label: 'Word Generated',
      type: 'animated'
    },
    {
      id: 'e3',
      source: 'process-1',
      target: 'action-2',
      label: 'Present',
      type: 'animated'
    },
    {
      id: 'e4',
      source: 'action-2',
      target: 'decision-1',
      label: 'Ideas Collected',
      type: 'animated'
    },
    {
      id: 'e5',
      source: 'decision-1',
      sourceHandle: 'yes',
      target: 'action-3',
      label: 'Need More',
      type: 'animated'
    },
    {
      id: 'e6',
      source: 'action-3',
      target: 'process-1',
      label: 'New Word',
      type: 'animated'
    },
    {
      id: 'e7',
      source: 'decision-1',
      sourceHandle: 'no',
      target: 'process-2',
      label: 'Enough Ideas',
      type: 'animated'
    },
    {
      id: 'e8',
      source: 'process-2',
      target: 'action-4',
      label: 'Categorized',
      type: 'animated'
    },
    {
      id: 'e9',
      source: 'action-4',
      target: 'process-3',
      label: 'Prioritized',
      type: 'animated'
    },
    {
      id: 'e10',
      source: 'process-3',
      target: 'end-1',
      label: 'Documented',
      type: 'animated'
    }
  ];

  return { nodes, edges };
};