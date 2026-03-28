import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { isDecisionNodeData, isActionNodeData, isStartNodeData, isProcessNodeData, isEndNodeData } from '../services/NodeConfigSchema';

const router = Router();
const prisma = new PrismaClient();

interface AuditIssue {
  nodeId: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

interface AuditResult {
  flowId: number;
  totalNodes: number;
  nodeTypes: Record<string, number>;
  issues: AuditIssue[];
  schemaCompliance: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
}

router.get('/flows/:id/audit', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const flow = await prisma.flowMaster.findUnique({
      where: { id: Number(id) },
      include: { nodes: true, edges: true }
    });
    
    if (!flow) {
      return res.status(404).json({ error: 'Flow not found' });
    }
    
    const issues: AuditIssue[] = [];
    const nodeTypes: Record<string, number> = {};
    let compliantNodes = 0;
    
    // Analyze each node
    flow.nodes.forEach(node => {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
      
      try {
        const data = JSON.parse(node.data);
        let isCompliant = false;
        
        // Schema validation
        switch (node.type) {
          case 'start':
            isCompliant = isStartNodeData(data);
            break;
          case 'decision':
            isCompliant = isDecisionNodeData(data);
            if (!isCompliant && data.conditions) {
              issues.push({
                nodeId: node.nodeId,
                type: node.type,
                severity: 'warning',
                message: 'Decision node has legacy condition format'
              });
            }
            break;
          case 'action':
            isCompliant = isActionNodeData(data);
            break;
          case 'process':
            isCompliant = isProcessNodeData(data);
            break;
          case 'end':
            isCompliant = isEndNodeData(data);
            break;
          default:
            isCompliant = true; // Visual nodes
        }
        
        if (isCompliant) compliantNodes++;
        
        // Check for missing labels
        if (!data.label || data.label.trim() === '') {
          issues.push({
            nodeId: node.nodeId,
            type: node.type,
            severity: 'error',
            message: 'Node missing required label'
          });
        }
        
        // Check for legacy formats
        if (data.actionType === 'undefined') {
          issues.push({
            nodeId: node.nodeId,
            type: node.type,
            severity: 'error',
            message: 'Action node has undefined actionType'
          });
        }
        
      } catch (error) {
        issues.push({
          nodeId: node.nodeId,
          type: node.type,
          severity: 'error',
          message: 'Invalid JSON in node data'
        });
      }
    });
    
    const result: AuditResult = {
      flowId: Number(id),
      totalNodes: flow.nodes.length,
      nodeTypes,
      issues,
      schemaCompliance: {
        compliant: compliantNodes,
        nonCompliant: flow.nodes.length - compliantNodes,
        percentage: Math.round((compliantNodes / flow.nodes.length) * 100)
      }
    };
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;