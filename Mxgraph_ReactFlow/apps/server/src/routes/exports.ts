import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { createLogger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();
const logger = createLogger();

/**
 * POST /api/exports/:diagramId
 * Create export artifact
 */
router.post('/:diagramId', asyncHandler(async (req: any, res: any) => {
  const { diagramId } = req.params;
  const { format } = req.body;

  if (!['svg', 'png', 'pdf'].includes(format)) {
    throw createError('Invalid format. Must be svg, png, or pdf', 400);
  }

  // Check if diagram exists
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId }
  });

  if (!diagram) {
    throw createError('Diagram not found', 404);
  }

  // TODO: Implement actual export generation using diagrams.net export server
  // For now, create a placeholder export
  const mockExportData = generateMockExport(format, diagram.name);
  
  const exportArtifact = await prisma.exportArtifact.create({
    data: {
      diagramId,
      kind: format,
      contentType: getContentType(format),
      bytes: Buffer.from(mockExportData, 'utf-8')
    }
  });

  // Log audit event
  await prisma.auditEvent.create({
    data: {
      diagramId,
      actor: req.headers['x-user-id'] || 'anonymous',
      action: 'export',
      payload: {
        format,
        size: mockExportData.length,
        artifactId: exportArtifact.id
      }
    }
  });

  logger.info(`Export created: ${exportArtifact.id} (${format}) for diagram ${diagramId}`);

  res.json({
    artifactId: exportArtifact.id,
    contentType: exportArtifact.contentType,
    size: exportArtifact.bytes.length
  });
}));

/**
 * GET /api/exports/:artifactId
 * Download export artifact
 */
router.get('/:artifactId', asyncHandler(async (req: any, res: any) => {
  const { artifactId } = req.params;

  const artifact = await prisma.exportArtifact.findUnique({
    where: { id: artifactId },
    include: {
      diagram: {
        select: { name: true }
      }
    }
  });

  if (!artifact) {
    throw createError('Export artifact not found', 404);
  }

  const filename = `${artifact.diagram.name}.${artifact.kind}`;

  res.set({
    'Content-Type': artifact.contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': artifact.bytes.length
  });

  res.send(artifact.bytes);
}));

/**
 * GET /api/exports/diagram/:diagramId
 * Get all exports for a diagram
 */
router.get('/diagram/:diagramId', asyncHandler(async (req: any, res: any) => {
  const { diagramId } = req.params;

  const exports = await prisma.exportArtifact.findMany({
    where: { diagramId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      kind: true,
      contentType: true,
      createdAt: true
    }
  });

  res.json({ exports });
}));

/**
 * DELETE /api/exports/:artifactId
 * Delete export artifact
 */
router.delete('/:artifactId', asyncHandler(async (req: any, res: any) => {
  const { artifactId } = req.params;

  const artifact = await prisma.exportArtifact.findUnique({
    where: { id: artifactId }
  });

  if (!artifact) {
    throw createError('Export artifact not found', 404);
  }

  await prisma.exportArtifact.delete({
    where: { id: artifactId }
  });

  logger.info(`Export artifact deleted: ${artifactId}`);

  res.json({ message: 'Export artifact deleted successfully' });
}));

/**
 * Generate mock export data (placeholder for real export implementation)
 */
function generateMockExport(format: string, diagramName: string): string {
  switch (format) {
    case 'svg':
      return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="100" height="40" fill="#0ea5e9" rx="4"/>
  <text x="60" y="30" text-anchor="middle" fill="white" font-family="Arial">${diagramName}</text>
  <text x="200" y="100" text-anchor="middle" fill="#666" font-family="Arial">Export placeholder - implement with diagrams.net</text>
</svg>`;
    
    case 'png':
      // Base64 encoded 1x1 transparent PNG
      return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    case 'pdf':
      return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
50 750 Td
(${diagramName} - Export placeholder) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
318
%%EOF`;
    
    default:
      return `Export placeholder for ${format} format of diagram: ${diagramName}`;
  }
}

/**
 * Get content type for export format
 */
function getContentType(format: string): string {
  switch (format) {
    case 'svg': return 'image/svg+xml';
    case 'png': return 'image/png';
    case 'pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

export { router as exportRoutes };