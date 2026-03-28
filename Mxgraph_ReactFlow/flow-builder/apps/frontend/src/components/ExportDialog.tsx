import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { X, Download, Image, FileImage, FileText, Link, Copy } from 'lucide-react';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toast } from 'sonner';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  flowId: number | null;
  flowName: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  flowId,
  flowName
}) => {
  const { getNodes, getEdges, getViewport } = useReactFlow();
  const [includeGrid, setIncludeGrid] = useState(false);
  const [includeSwimlanes, setIncludeSwimlanes] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [exporting, setExporting] = useState(false);

  const exportToPNG = async () => {
    try {
      setExporting(true);
      const nodes = getNodes();
      const nodesBounds = getNodesBounds(nodes);
      const viewport = getViewportForBounds(nodesBounds, 1200, 800, 0.5, 2);
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1200 * scaleFactor;
      canvas.height = 800 * scaleFactor;
      
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid if enabled
        if (includeGrid) {
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          const gridSize = 20 * scaleFactor;
          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
        }
        
        // Simple node rendering
        nodes.forEach(node => {
          const x = (node.position.x - nodesBounds.x) * scaleFactor;
          const y = (node.position.y - nodesBounds.y) * scaleFactor;
          const width = 150 * scaleFactor;
          const height = 40 * scaleFactor;
          
          // Draw node background
          ctx.fillStyle = node.data.style?.fillColor || '#ffffff';
          ctx.fillRect(x, y, width, height);
          
          // Draw node border
          ctx.strokeStyle = node.data.style?.borderColor || '#64748b';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          // Draw node label
          ctx.fillStyle = node.data.style?.textColor || '#1e293b';
          ctx.font = `${14 * scaleFactor}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(node.data.label || node.type, x + width/2, y + height/2 + 5);
        });
      }
      
      // Download canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${flowName || 'flow'}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('PNG exported successfully');
        }
      });
    } catch (error) {
      console.error('PNG export failed:', error);
      toast.error('PNG export failed');
    } finally {
      setExporting(false);
    }
  };

  const exportToSVG = async () => {
    try {
      setExporting(true);
      const nodes = getNodes();
      const edges = getEdges();
      const nodesBounds = getNodesBounds(nodes);
      
      const width = (nodesBounds.width + 100) * scaleFactor;
      const height = (nodesBounds.height + 100) * scaleFactor;
      
      let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
      
      // Background
      svg += `<rect width="100%" height="100%" fill="#f8fafc"/>`;
      
      // Grid
      if (includeGrid) {
        const gridSize = 20 * scaleFactor;
        svg += `<defs><pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">`;
        svg += `<path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`;
        svg += `</pattern></defs>`;
        svg += `<rect width="100%" height="100%" fill="url(#grid)"/>`;
      }
      
      // Edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const x1 = (sourceNode.position.x - nodesBounds.x + 75) * scaleFactor;
          const y1 = (sourceNode.position.y - nodesBounds.y + 20) * scaleFactor;
          const x2 = (targetNode.position.x - nodesBounds.x + 75) * scaleFactor;
          const y2 = (targetNode.position.y - nodesBounds.y + 20) * scaleFactor;
          
          svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>`;
          
          if (edge.label) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            svg += `<text x="${midX}" y="${midY}" text-anchor="middle" fill="#1e293b" font-size="${12 * scaleFactor}">${edge.label}</text>`;
          }
        }
      });
      
      // Arrow marker
      svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">`;
      svg += `<polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/></marker></defs>`;
      
      // Nodes
      nodes.forEach(node => {
        const x = (node.position.x - nodesBounds.x) * scaleFactor;
        const y = (node.position.y - nodesBounds.y) * scaleFactor;
        const width = 150 * scaleFactor;
        const height = 40 * scaleFactor;
        
        svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" `;
        svg += `fill="${node.data.style?.fillColor || '#ffffff'}" `;
        svg += `stroke="${node.data.style?.borderColor || '#64748b'}" stroke-width="2"/>`;
        
        svg += `<text x="${x + width/2}" y="${y + height/2 + 5}" text-anchor="middle" `;
        svg += `fill="${node.data.style?.textColor || '#1e293b'}" font-size="${14 * scaleFactor}">`;
        svg += `${node.data.label || node.type}</text>`;
      });
      
      svg += '</svg>';
      
      // Download SVG
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${flowName || 'flow'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('SVG exported successfully');
    } catch (error) {
      console.error('SVG export failed:', error);
      toast.error('SVG export failed');
    } finally {
      setExporting(false);
    }
  };

  const generateEmbedCode = () => {
    if (!flowId) {
      toast.error('Please save the flow first');
      return;
    }
    
    const embedUrl = `${window.location.origin}/flows/${flowId}/embed`;
    const embedCode = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0"></iframe>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      toast.success('Embed code copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy embed code');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Export Flow</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="font-medium">Export Options</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-grid"
                  checked={includeGrid}
                  onCheckedChange={setIncludeGrid}
                />
                <Label htmlFor="include-grid">Include Grid</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-swimlanes"
                  checked={includeSwimlanes}
                  onCheckedChange={setIncludeSwimlanes}
                />
                <Label htmlFor="include-swimlanes">Include Swimlanes</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scale-factor">Scale Factor</Label>
              <Input
                id="scale-factor"
                type="number"
                min="0.5"
                max="3"
                step="0.1"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
          
          {/* Export Formats */}
          <div className="space-y-4">
            <h3 className="font-medium">Export Formats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Image className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">PNG Image</h4>
                    <p className="text-sm text-gray-600">Raster image format</p>
                  </div>
                </div>
                <Button
                  onClick={exportToPNG}
                  disabled={exporting}
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileImage className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">SVG Vector</h4>
                    <p className="text-sm text-gray-600">Scalable vector format</p>
                  </div>
                </div>
                <Button
                  onClick={exportToSVG}
                  disabled={exporting}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export SVG
                </Button>
              </Card>
            </div>
          </div>
          
          {/* Embed Code */}
          <div className="space-y-4">
            <h3 className="font-medium">Embed Code</h3>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Link className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Embed in Website</h4>
                  <p className="text-sm text-gray-600">Read-only iframe embed</p>
                </div>
              </div>
              <Button
                onClick={generateEmbedCode}
                disabled={!flowId}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Embed Code
              </Button>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};