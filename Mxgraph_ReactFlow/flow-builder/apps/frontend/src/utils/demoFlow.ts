import { Node, Edge } from '@xyflow/react';

export const createDemoFlow = (): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Start Process',
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
      position: { x: 300, y: 100 },
      data: {
        label: 'Check Status',
        conditions: [
          { id: 'approved', condition: 'status === "approved"', label: 'Approved' },
          { id: 'rejected', condition: 'status === "rejected"', label: 'Rejected' }
        ],
        defaultPath: 'Pending',
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
        label: 'Send Approval Email',
        actionType: 'email',
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
        label: 'Send Rejection Email',
        actionType: 'email',
        style: {
          fillColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 14,
          icon: 'zap'
        }
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 700, y: 100 },
      data: {
        label: 'Process Complete',
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
      sourceHandle: 'approved',
      target: 'action-1',
      label: 'Approved',
      type: 'animated'
    },
    {
      id: 'e3',
      source: 'decision-1',
      sourceHandle: 'rejected',
      target: 'action-2',
      label: 'Rejected',
      type: 'animated'
    },
    {
      id: 'e4',
      source: 'action-1',
      target: 'end-1',
      label: 'Complete',
      type: 'animated'
    },
    {
      id: 'e5',
      source: 'action-2',
      target: 'end-1',
      label: 'Complete',
      type: 'animated'
    }
  ];

  return { nodes, edges };
};