import { FlowGraph } from '../lib/graph';
import { evaluate } from '../lib/expression';
import { isStartNodeData, isDecisionNodeData, isActionNodeData, isProcessNodeData, isEndNodeData } from './NodeConfigSchema';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FlowData {
  nodes: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}

export class FlowValidator {
  static validate(flow: FlowData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for exactly one start node
    const startNodes = flow.nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push('Flow must have exactly one Start node');
    } else if (startNodes.length > 1) {
      errors.push('Flow can only have one Start node');
    }
    
    // Check for at least one end node
    const endNodes = flow.nodes.filter(n => n.type === 'end');
    if (endNodes.length === 0) {
      errors.push('Flow must have at least one End node');
    }
    
    // Check edge validity
    const nodeIds = new Set(flow.nodes.map(n => n.id));
    flow.edges.forEach(edge => {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge references non-existent source node: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge references non-existent target node: ${edge.target}`);
      }
    });
    
    // Check reachability from start to end nodes
    if (startNodes.length === 1 && endNodes.length > 0) {
      const graph = new FlowGraph(flow.nodes, flow.edges);
      const startId = startNodes[0].id;
      
      endNodes.forEach(endNode => {
        if (!graph.isReachable(startId, endNode.id)) {
          errors.push(`End node ${endNode.id} is not reachable from Start node`);
        }
      });
    }
    
    // Validate decision nodes (MECE)
    flow.nodes.filter(n => n.type === 'decision').forEach(node => {
      const conditions = node.data.conditions || [];
      const labels = conditions.map((c: any) => c.label);
      
      // Check unique labels
      const uniqueLabels = new Set(labels);
      if (uniqueLabels.size !== labels.length) {
        errors.push(`Decision node ${node.id} has duplicate condition labels`);
      }
      
      // Check default path exists
      if (!node.data.defaultPath) {
        errors.push(`Decision node ${node.id} must have a default path`);
      }
      
      // Validate expressions
      conditions.forEach((condition: any) => {
        try {
          evaluate(condition.expression, { test: 1 });
        } catch (error) {
          errors.push(`Decision node ${node.id} has invalid expression: ${condition.expression}`);
        }
      });
    });
    
    // Validate action nodes
    flow.nodes.filter(n => n.type === 'action').forEach(node => {
      const validActionTypes = ['email', 'api', 'db'];
      const actionType = node.data.actionType;
      
      if (!actionType || actionType === 'undefined' || !validActionTypes.includes(actionType)) {
        errors.push(`Action node ${node.id} must have a valid actionType (email, api, or db). Current: ${actionType || 'undefined'}`);
      }
    });
    
    // Validate process nodes
    flow.nodes.filter(n => n.type === 'process').forEach(node => {
      if (!node.data.label || node.data.label.trim() === '') {
        errors.push(`Process node ${node.id} must have a label`);
      }
    });
    
    // Validate connector nodes
    flow.nodes.filter(n => n.type === 'connector').forEach(node => {
      const incomingEdges = flow.edges.filter(e => e.target === node.id);
      const outgoingEdges = flow.edges.filter(e => e.source === node.id);
      
      if (incomingEdges.length === 0) {
        errors.push(`Connector node ${node.id} must have at least one incoming connection`);
      }
      if (outgoingEdges.length === 0) {
        errors.push(`Connector node ${node.id} must have at least one outgoing connection`);
      }
    });
    
    // Validate new shape nodes (diagrammatic only - no execution validation needed)
    const diagrammaticTypes = ['document', 'database', 'inputoutput', 'annotation'];
    flow.nodes.filter(n => diagrammaticTypes.includes(n.type)).forEach(node => {
      if (!node.data.label || node.data.label.trim() === '') {
        errors.push(`${node.type} node ${node.id} must have a label`);
      }
      // Store shapeType for persistence
      if (!node.data.shapeType) {
        node.data.shapeType = node.type;
      }
    });
    
    // Schema validation warnings (non-breaking)
    flow.nodes.forEach(node => {
      try {
        switch (node.type) {
          case 'start':
            if (!isStartNodeData(node.data)) {
              warnings.push(`Start node ${node.id} has invalid schema`);
            }
            break;
          case 'decision':
            if (!isDecisionNodeData(node.data)) {
              warnings.push(`Decision node ${node.id} has invalid schema`);
            }
            break;
          case 'action':
            if (!isActionNodeData(node.data)) {
              warnings.push(`Action node ${node.id} has invalid schema`);
            }
            break;
          case 'process':
            if (!isProcessNodeData(node.data)) {
              warnings.push(`Process node ${node.id} has invalid schema`);
            }
            break;
          case 'end':
            if (!isEndNodeData(node.data)) {
              warnings.push(`End node ${node.id} has invalid schema`);
            }
            break;
        }
      } catch (error) {
        warnings.push(`Schema validation failed for node ${node.id}: ${error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}