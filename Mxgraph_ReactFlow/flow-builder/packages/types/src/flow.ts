/**
 * Flow entity types
 */
import type { AuditableEntity } from './common';

export interface Flow extends AuditableEntity {
  name: string;
  description?: string;
  version: number;
  isActive: boolean;
  tenantId: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowVersion extends AuditableEntity {
  flowId: string;
  version: number;
  snapshot: FlowSnapshot;
  changelog?: string;
}

export interface FlowSnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
  metadata?: Record<string, unknown>;
}

// Re-export for convenience
export type { FlowNode } from './node';
export type { FlowEdge } from './edge';