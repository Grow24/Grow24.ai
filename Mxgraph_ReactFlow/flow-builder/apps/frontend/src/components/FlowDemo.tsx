import React from 'react';
import { Node, Edge } from '@xyflow/react';

// Salesforce Flow-like demo data
export const salesforceFlowDemo: { nodes: Node[], edges: Edge[] } = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 50 },
      data: { label: 'Lead Qualification Flow' },
    },
    {
      id: 'screen-1',
      type: 'screen',
      position: { x: 100, y: 150 },
      data: { 
        label: 'Capture Lead Info',
        fields: [
          { id: '1', type: 'text', label: 'Company Name', required: true },
          { id: '2', type: 'email', label: 'Email', required: true },
          { id: '3', type: 'number', label: 'Annual Revenue', required: false },
          { id: '4', type: 'select', label: 'Industry', required: true }
        ]
      },
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 100, y: 280 },
      data: { 
        label: 'Revenue > $1M?',
        conditions: [
          { id: '1', field: 'annual_revenue', operator: 'greater_than', value: '1000000', label: 'High Value' }
        ]
      },
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Assign to Enterprise Team',
        actionType: 'assignment',
        parameters: { team: 'enterprise', priority: 'high' }
      },
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 300, y: 360 },
      data: { 
        label: 'Assign to SMB Team',
        actionType: 'assignment',
        parameters: { team: 'smb', priority: 'medium' }
      },
    },
    {
      id: 'decision-2',
      type: 'decision',
      position: { x: 500, y: 200 },
      data: { 
        label: 'Industry = Tech?',
        conditions: [
          { id: '1', field: 'industry', operator: 'equals', value: 'technology', label: 'Tech Company' }
        ]
      },
    },
    {
      id: 'action-3',
      type: 'action',
      position: { x: 700, y: 120 },
      data: { 
        label: 'Send Tech Welcome Email',
        actionType: 'email',
        parameters: { template: 'tech_welcome', delay: '0' }
      },
    },
    {
      id: 'action-4',
      type: 'action',
      position: { x: 700, y: 280 },
      data: { 
        label: 'Send Standard Welcome',
        actionType: 'email',
        parameters: { template: 'standard_welcome', delay: '0' }
      },
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 900, y: 200 },
      data: { 
        label: 'Lead Processed',
        status: 'success'
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'start-1', target: 'screen-1' },
    { id: 'e2-3', source: 'screen-1', target: 'decision-1' },
    { id: 'e3-4', source: 'decision-1', target: 'action-1', data: { label: 'Yes (>$1M)' } },
    { id: 'e3-5', source: 'decision-1', target: 'action-2', data: { label: 'No (<$1M)' } },
    { id: 'e4-6', source: 'action-1', target: 'decision-2' },
    { id: 'e6-7', source: 'decision-2', target: 'action-3', data: { label: 'Tech' } },
    { id: 'e6-8', source: 'decision-2', target: 'action-4', data: { label: 'Other' } },
    { id: 'e7-9', source: 'action-3', target: 'end-1' },
    { id: 'e8-9', source: 'action-4', target: 'end-1' },
    { id: 'e5-9', source: 'action-2', target: 'end-1' },
  ]
};

// MECE Structure demo data
export const meceStructureDemo: { nodes: Node[], edges: Edge[] } = {
  nodes: [
    {
      id: 'start-mece',
      type: 'start',
      position: { x: 50, y: 50 },
      data: { label: 'Customer Segmentation' },
    },
    {
      id: 'decision-size',
      type: 'decision',
      position: { x: 50, y: 150 },
      data: { 
        label: 'Company Size',
        conditions: [
          { id: '1', field: 'employees', operator: 'less_than', value: '50', label: 'Small' },
          { id: '2', field: 'employees', operator: 'between', value: '50-500', label: 'Medium' },
          { id: '3', field: 'employees', operator: 'greater_than', value: '500', label: 'Large' }
        ]
      },
    },
    // Small Company Branch
    {
      id: 'action-small',
      type: 'action',
      position: { x: 250, y: 100 },
      data: { label: 'Small Business Process', actionType: 'workflow' },
    },
    // Medium Company Branch
    {
      id: 'decision-industry',
      type: 'decision',
      position: { x: 250, y: 200 },
      data: { 
        label: 'Industry Type',
        conditions: [
          { id: '1', field: 'industry', operator: 'equals', value: 'tech', label: 'Technology' },
          { id: '2', field: 'industry', operator: 'equals', value: 'finance', label: 'Finance' },
          { id: '3', field: 'industry', operator: 'not_in', value: 'tech,finance', label: 'Other' }
        ]
      },
    },
    {
      id: 'action-med-tech',
      type: 'action',
      position: { x: 450, y: 150 },
      data: { label: 'Tech Mid-Market', actionType: 'assignment' },
    },
    {
      id: 'action-med-finance',
      type: 'action',
      position: { x: 450, y: 200 },
      data: { label: 'Finance Mid-Market', actionType: 'assignment' },
    },
    {
      id: 'action-med-other',
      type: 'action',
      position: { x: 450, y: 250 },
      data: { label: 'General Mid-Market', actionType: 'assignment' },
    },
    // Large Company Branch
    {
      id: 'action-large',
      type: 'action',
      position: { x: 250, y: 300 },
      data: { label: 'Enterprise Process', actionType: 'workflow' },
    },
    // End nodes
    {
      id: 'end-small',
      type: 'end',
      position: { x: 650, y: 100 },
      data: { label: 'Small Complete', status: 'success' },
    },
    {
      id: 'end-medium',
      type: 'end',
      position: { x: 650, y: 200 },
      data: { label: 'Medium Complete', status: 'success' },
    },
    {
      id: 'end-large',
      type: 'end',
      position: { x: 650, y: 300 },
      data: { label: 'Large Complete', status: 'success' },
    },
  ],
  edges: [
    { id: 'e-start-size', source: 'start-mece', target: 'decision-size' },
    
    // MECE branches - mutually exclusive paths
    { id: 'e-size-small', source: 'decision-size', target: 'action-small', data: { label: '<50 employees' } },
    { id: 'e-size-medium', source: 'decision-size', target: 'decision-industry', data: { label: '50-500 employees' } },
    { id: 'e-size-large', source: 'decision-size', target: 'action-large', data: { label: '>500 employees' } },
    
    // Medium company sub-branches (also MECE)
    { id: 'e-industry-tech', source: 'decision-industry', target: 'action-med-tech', data: { label: 'Technology' } },
    { id: 'e-industry-finance', source: 'decision-industry', target: 'action-med-finance', data: { label: 'Finance' } },
    { id: 'e-industry-other', source: 'decision-industry', target: 'action-med-other', data: { label: 'Other Industries' } },
    
    // To end nodes
    { id: 'e-small-end', source: 'action-small', target: 'end-small' },
    { id: 'e-med-tech-end', source: 'action-med-tech', target: 'end-medium' },
    { id: 'e-med-finance-end', source: 'action-med-finance', target: 'end-medium' },
    { id: 'e-med-other-end', source: 'action-med-other', target: 'end-medium' },
    { id: 'e-large-end', source: 'action-large', target: 'end-large' },
  ]
};