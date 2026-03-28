import { Router } from 'express';
import { z } from 'zod';
// Simple XML parser without external dependency
function parseXML(xmlString: string) {
  // Basic XML parsing for Draw.io format
  const cellMatches = xmlString.match(/<mxCell[^>]*>/g) || [];
  const cells = cellMatches.map(match => {
    const attrs: any = {};
    const attrMatches = match.match(/(\w+)="([^"]*)"/g) || [];
    attrMatches.forEach(attr => {
      const [key, value] = attr.split('=');
      attrs[key] = value.replace(/"/g, '');
    });
    return attrs;
  });
  return cells;
}

const router = Router();

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  position: z.object({ x: z.number(), y: z.number() }),
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
});

const flowImportSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  name: z.string().optional(),
});

// Parse Draw.io XML to flow format
function parseDrawioXML(xmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  
  const nodes: any[] = [];
  const edges: any[] = [];
  const report = {
    mapped: 0,
    skipped: 0,
    warnings: [] as string[]
  };

  // Find all mxCell elements
  const cells = doc.getElementsByTagName('mxCell');
  
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const id = cell.getAttribute('id');
    const value = cell.getAttribute('value') || '';
    const style = cell.getAttribute('style') || '';
    const geometry = cell.getElementsByTagName('mxGeometry')[0];
    
    if (!id || id === '0' || id === '1') continue; // Skip root cells
    
    if (geometry) {
      const x = parseFloat(geometry.getAttribute('x') || '0');
      const y = parseFloat(geometry.getAttribute('y') || '0');
      const width = parseFloat(geometry.getAttribute('width') || '100');
      const height = parseFloat(geometry.getAttribute('height') || '40');
      
      // Check if it's an edge
      const source = cell.getAttribute('source');
      const target = cell.getAttribute('target');
      
      if (source && target) {
        // It's an edge
        edges.push({
          id: `edge-${id}`,
          source: `node-${source}`,
          target: `node-${target}`,
          label: value
        });
        report.mapped++;
      } else {
        // It's a node - map shape to node type
        let nodeType = 'process'; // default
        
        if (style.includes('ellipse')) {
          nodeType = value.toLowerCase().includes('start') ? 'start' : 'end';
        } else if (style.includes('rhombus')) {
          nodeType = 'decision';
        } else if (style.includes('rectangle')) {
          nodeType = 'action';
        }
        
        nodes.push({
          id: `node-${id}`,
          type: nodeType,
          position: { x, y },
          data: {
            label: value || nodeType,
            width,
            height
          }
        });
        report.mapped++;
      }
    } else {
      report.skipped++;
      report.warnings.push(`Skipped element ${id}: no geometry`);
    }
  }
  
  return {
    nodes,
    edges,
    report
  };
}

router.post('/json', async (req, res) => {
  try {
    const { flowData, createNew = false } = req.body;
    
    // Validate the imported data
    const validatedData = flowImportSchema.parse(flowData);
    
    const report = {
      mapped: validatedData.nodes.length + validatedData.edges.length,
      skipped: 0,
      warnings: [] as string[]
    };
    
    // Validate node types
    const validTypes = ['start', 'decision', 'action', 'process', 'connector', 'end'];
    validatedData.nodes.forEach(node => {
      if (!validTypes.includes(node.type)) {
        node.type = 'process'; // fallback
        report.warnings.push(`Unknown node type '${node.type}' converted to 'process'`);
      }
    });
    
    res.json({
      success: true,
      data: validatedData,
      report
    });
  } catch (error) {
    console.error('JSON import failed:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      details: error instanceof z.ZodError ? error.errors : error
    });
  }
});

router.post('/drawio', async (req, res) => {
  try {
    const { xmlContent } = req.body;
    
    if (!xmlContent || typeof xmlContent !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'XML content is required'
      });
    }
    
    const result = parseDrawioXML(xmlContent);
    
    res.json({
      success: true,
      data: {
        nodes: result.nodes,
        edges: result.edges,
        name: 'Imported from Draw.io'
      },
      report: result.report
    });
  } catch (error) {
    console.error('Draw.io import failed:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to parse Draw.io XML',
      details: error
    });
  }
});

export default router;