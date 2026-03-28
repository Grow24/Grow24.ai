import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LegacyCondition {
  id: string;
  label: string;
  expression: string;
}

// Parse legacy expression into structured format
function parseExpression(expression: string): { field: string; operator: string; value: any } | null {
  const patterns = [
    { regex: /(\w+)\s*>=\s*(.+)/, operator: 'greater_than_or_equal' },
    { regex: /(\w+)\s*>\s*(.+)/, operator: 'greater_than' },
    { regex: /(\w+)\s*<=\s*(.+)/, operator: 'less_than_or_equal' },
    { regex: /(\w+)\s*<\s*(.+)/, operator: 'less_than' },
    { regex: /(\w+)\s*===?\s*(.+)/, operator: 'equals' },
    { regex: /(\w+)\s*!==?\s*(.+)/, operator: 'not_equals' },
  ];

  for (const pattern of patterns) {
    const match = expression.match(pattern.regex);
    if (match) {
      const field = match[1];
      let value: any = match[2];
      
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value))) value = Number(value);
      else value = value.replace(/['"]/g, '');
      
      return { field, operator: pattern.operator, value };
    }
  }
  
  return null;
}

async function migrateNodeData() {
  console.log('Starting node data normalization...');
  
  const flows = await prisma.flowMaster.findMany({
    include: { nodes: true }
  });
  
  let migratedCount = 0;
  
  for (const flow of flows) {
    console.log(`Processing flow ${flow.id}: ${flow.name}`);
    
    // Create snapshot before migration
    const snapshot = {
      name: flow.name,
      description: flow.description,
      nodes: flow.nodes.map(n => ({
        id: n.nodeId,
        type: n.type,
        data: JSON.parse(n.data),
        position: { x: n.positionX, y: n.positionY }
      }))
    };
    
    await prisma.flowVersionHistory.create({
      data: {
        flowId: flow.id,
        version: flow.version,
        jsonBackup: JSON.stringify(snapshot),
        author: 'migration-script'
      }
    });
    
    for (const node of flow.nodes) {
      try {
        const data = JSON.parse(node.data);
        let updated = false;
        
        // Migrate decision nodes
        if (node.type === 'decision' && data.conditions) {
          const conditions = data.conditions as LegacyCondition[];
          const structuredConditions = conditions.map(condition => {
            const parsed = parseExpression(condition.expression);
            return {
              id: condition.id,
              label: condition.label,
              expression: condition.expression,
              ...(parsed && { structured: parsed })
            };
          });
          
          data.conditions = structuredConditions;
          updated = true;
        }
        
        // Fix undefined actionTypes
        if (node.type === 'action' && data.actionType === 'undefined') {
          data.actionType = 'email';
          updated = true;
        }
        
        // Ensure all nodes have labels
        if (!data.label || data.label.trim() === '') {
          data.label = node.type.charAt(0).toUpperCase() + node.type.slice(1);
          updated = true;
        }
        
        if (updated) {
          await prisma.nodeMaster.update({
            where: { id: node.id },
            data: { data: JSON.stringify(data) }
          });
          migratedCount++;
        }
        
      } catch (error) {
        console.error(`Error processing node ${node.nodeId}:`, error);
      }
    }
  }
  
  console.log(`Migration complete. Updated ${migratedCount} nodes.`);
}

// Run migration
migrateNodeData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());