import { Node, Edge } from '@xyflow/react';

export interface FlowExportData {
  flowName: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    createdAt: string;
    version: string;
    author?: string;
  };
}

export class FlowExporter {
  static exportAsJSON(data: FlowExportData): void {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      format: 'HBMP Flow Builder v1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    this.downloadFile(blob, `${data.flowName.replace(/\s+/g, '_')}_flow.json`);
  }

  static exportAsCSV(data: FlowExportData): void {
    const csvContent = this.generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    this.downloadFile(blob, `${data.flowName.replace(/\s+/g, '_')}_flow.csv`);
  }

  static exportFlowDiagram(nodes: Node[], edges: Edge[], flowName: string): void {
    const diagram = this.generateTextDiagram(nodes, edges);
    const blob = new Blob([diagram], { type: 'text/plain' });
    this.downloadFile(blob, `${flowName.replace(/\s+/g, '_')}_diagram.txt`);
  }

  private static generateCSV(data: FlowExportData): string {
    const headers = ['Type', 'ID', 'Label', 'Position X', 'Position Y', 'Configuration'];
    const rows = [headers.join(',')];

    data.nodes.forEach(node => {
      const config = JSON.stringify(node.data).replace(/"/g, '""');
      rows.push([
        'Node',
        node.id,
        `"${node.data.label || node.type}"`,
        node.position.x.toString(),
        node.position.y.toString(),
        `"${config}"`
      ].join(','));
    });

    data.edges.forEach(edge => {
      rows.push([
        'Edge',
        edge.id,
        `"${edge.label || 'Connection'}"`,
        '',
        '',
        `"Source: ${edge.source}, Target: ${edge.target}"`
      ].join(','));
    });

    return rows.join('\n');
  }

  private static generateTextDiagram(nodes: Node[], edges: Edge[]): string {
    const lines = [];
    lines.push('FLOW DIAGRAM');
    lines.push('='.repeat(50));
    lines.push('');

    const nodesByType = nodes.reduce((acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    }, {} as Record<string, Node[]>);

    Object.entries(nodesByType).forEach(([type, typeNodes]) => {
      lines.push(`${type.toUpperCase()} NODES:`);
      typeNodes.forEach(node => {
        lines.push(`  - ${node.data.label || node.id}`);
      });
      lines.push('');
    });

    lines.push('CONNECTIONS:');
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      const sourceName = sourceNode?.data.label || edge.source;
      const targetName = targetNode?.data.label || edge.target;
      lines.push(`  ${sourceName} → ${targetName}`);
    });

    return lines.join('\n');
  }

  private static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const exportFlowAsJSON = (flowName: string, nodes: Node[], edges: Edge[]) => {
  const data: FlowExportData = {
    flowName,
    nodes,
    edges,
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0',
      author: 'HBMP Flow Builder User'
    }
  };
  FlowExporter.exportAsJSON(data);
};

export const exportFlowAsCSV = (flowName: string, nodes: Node[], edges: Edge[]) => {
  const data: FlowExportData = {
    flowName,
    nodes,
    edges,
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0'
    }
  };
  FlowExporter.exportAsCSV(data);
};

export const exportFlowDiagram = (flowName: string, nodes: Node[], edges: Edge[]) => {
  FlowExporter.exportFlowDiagram(nodes, edges, flowName);
};