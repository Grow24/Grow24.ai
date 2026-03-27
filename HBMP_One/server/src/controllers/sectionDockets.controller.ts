import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Valid item types
const VALID_ITEM_TYPES = ['HBMP_DOC', 'GOOGLE_DOC', 'GOOGLE_SHEET', 'GOOGLE_SLIDE', 'FILE', 'LINK', 'SHEET', 'SLIDE'] as const;
type ItemType = typeof VALID_ITEM_TYPES[number];

/**
 * POST /api/section-dockets
 * Create a section docket (idempotent - returns existing if found)
 * body: { documentId: string, sectionId: string, title?: string, description?: string }
 */
export const createSectionDocket = async (req: Request, res: Response) => {
  try {
    const { documentId, sectionId, title, description } = req.body;

    if (!documentId || !sectionId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'documentId and sectionId are required',
        },
      });
    }

    // Verify document exists
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      include: {
        template: {
          include: {
            sections: {
              where: { id: sectionId },
            },
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    // Check if section exists in template
    const section = document.template.sections.find((s) => s.id === sectionId);
    if (!section) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section not found in template',
        },
      });
    }

    // Use idempotent create: try to find existing, otherwise create
    const existingDocket = await prisma.sectionDocket.findUnique({
      where: {
        documentId_sectionId: {
          documentId,
          sectionId,
        },
      },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (existingDocket) {
      return res.json(existingDocket);
    }

    // Create new docket
    const docket = await prisma.sectionDocket.create({
      data: {
        documentId,
        sectionId,
        title: title || section.title,
        description,
        status: 'ACTIVE',
      },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.status(201).json(docket);
  } catch (error: any) {
    console.error('Error creating section docket:', error);
    res.status(500).json({
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create section docket',
        details: error.message,
      },
    });
  }
};

/**
 * GET /api/section-dockets/by-section
 * Get section docket by documentId and sectionId
 * query: documentId, sectionId
 */
export const getSectionDocketBySection = async (req: Request, res: Response) => {
  try {
    const { documentId, sectionId } = req.query;

    if (!documentId || !sectionId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'documentId and sectionId are required',
        },
      });
    }

    const docket = await prisma.sectionDocket.findUnique({
      where: {
        documentId_sectionId: {
          documentId: documentId as string,
          sectionId: sectionId as string,
        },
      },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!docket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section docket not found',
        },
      });
    }

    res.json(docket);
  } catch (error: any) {
    console.error('Error fetching section docket:', error);
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch section docket',
        details: error.message,
      },
    });
  }
};

/**
 * POST /api/section-dockets/:id/items
 * Add an item to a section docket
 * body: { itemType, title, refId?, url?, attachmentId?, metadata? }
 */
export const addSectionDocketItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { itemType, title, refId, url, attachmentId, metadata } = req.body;

    if (!itemType || !title) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'itemType and title are required',
        },
      });
    }

    if (!VALID_ITEM_TYPES.includes(itemType as ItemType)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid itemType. Must be one of: ${VALID_ITEM_TYPES.join(', ')}`,
        },
      });
    }

    // Validate required fields per item type
    if (itemType === 'HBMP_DOC' && !refId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'refId is required for HBMP_DOC items',
        },
      });
    }

    if ((itemType === 'GOOGLE_DOC' || itemType === 'GOOGLE_SHEET' || itemType === 'GOOGLE_SLIDE' || itemType === 'LINK') && !url) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'url is required for GOOGLE_* and LINK items',
        },
      });
    }

    if (itemType === 'FILE' && !attachmentId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'attachmentId is required for FILE items',
        },
      });
    }

    // Verify docket exists
    const docket = await prisma.sectionDocket.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!docket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section docket not found',
        },
      });
    }

    // If refId provided for HBMP_DOC, verify document exists
    // For SHEET items, refId is the fileId (not a document reference), so skip validation
    if (refId && itemType === 'HBMP_DOC') {
      const refDoc = await prisma.documentInstance.findUnique({
        where: { id: refId },
      });
      if (!refDoc) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Referenced document not found',
          },
        });
      }
    }

    // If attachmentId provided, verify attachment exists
    if (attachmentId) {
      const attachment = await prisma.attachment.findUnique({
        where: { id: attachmentId },
      });
      if (!attachment) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Attachment not found',
          },
        });
      }
    }

    // Get max orderIndex to append at end
    const maxOrderIndex = docket.items.length > 0
      ? Math.max(...docket.items.map((item) => item.orderIndex))
      : -1;

    // Serialize metadata if provided
    const metadataString = metadata ? JSON.stringify(metadata) : null;

    const item = await prisma.sectionDocketItem.create({
      data: {
        sectionDocketId: id,
        itemType,
        title,
        refId: refId || null,
        url: url || null,
        attachmentId: attachmentId || null,
        orderIndex: maxOrderIndex + 1,
        metadata: metadataString,
      },
    });

    // Return updated docket with all items
    const updatedDocket = await prisma.sectionDocket.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.status(201).json({ item, docket: updatedDocket });
  } catch (error: any) {
    console.error('Error adding section docket item:', error);
    res.status(500).json({
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to add section docket item',
        details: error.message,
      },
    });
  }
};

/**
 * PUT /api/section-dockets/:id/items/reorder
 * Reorder items in a section docket
 * body: { orderedItemIds: string[] }
 */
export const reorderSectionDocketItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderedItemIds } = req.body;

    if (!Array.isArray(orderedItemIds)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'orderedItemIds must be an array',
        },
      });
    }

    // Verify docket exists
    const docket = await prisma.sectionDocket.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!docket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section docket not found',
        },
      });
    }

    // Verify all item IDs belong to this docket
    const docketItemIds = new Set(docket.items.map((item) => item.id));
    const invalidIds = orderedItemIds.filter((itemId: string) => !docketItemIds.has(itemId));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid item IDs: ${invalidIds.join(', ')}`,
        },
      });
    }

    // Use transaction to update all orderIndex values
    await prisma.$transaction(
      orderedItemIds.map((itemId: string, index: number) =>
        prisma.sectionDocketItem.update({
          where: { id: itemId },
          data: { orderIndex: index },
        })
      )
    );

    // Return updated docket with reordered items
    const updatedDocket = await prisma.sectionDocket.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.json(updatedDocket);
  } catch (error: any) {
    console.error('Error reordering section docket items:', error);
    res.status(500).json({
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to reorder section docket items',
        details: error.message,
      },
    });
  }
};

/**
 * DELETE /api/section-dockets/items/:itemId
 * Delete a section docket item
 */
export const deleteSectionDocketItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    // Verify item exists
    const item = await prisma.sectionDocketItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section docket item not found',
        },
      });
    }

    await prisma.sectionDocketItem.delete({
      where: { id: itemId },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting section docket item:', error);
    res.status(500).json({
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete section docket item',
        details: error.message,
      },
    });
  }
};

/**
 * POST /api/section-dockets/:id/create-child-doc
 * Create a child DocumentInstance from a template and link it as a SectionDocketItem
 * body: { templateId: string, title?: string }
 */
export const createChildDocInSectionDocket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { templateId, title } = req.body;

    if (!templateId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'templateId is required',
        },
      });
    }

    // Verify docket exists and get parent document
    const docket = await prisma.sectionDocket.findUnique({
      where: { id },
      include: {
        document: {
          include: {
            template: {
              include: {
                sections: {
                  include: {
                    fields: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!docket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Section docket not found',
        },
      });
    }

    // Verify template exists
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!template) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found',
        },
      });
    }

    // Get parent document's project and docket
    const parentDoc = docket.document;
    const childTitle = title || `${template.name} - ${parentDoc.title}`;

    // Use transaction to create child document and link item
    const result = await prisma.$transaction(async (tx) => {
      // Create child document in same project and docket as parent
      const childDocument = await tx.documentInstance.create({
        data: {
          projectId: parentDoc.projectId,
          docketId: parentDoc.docketId, // Same docket as parent (could be configurable later)
          templateId,
          title: childTitle,
          level: template.level,
          status: 'DRAFT',
          version: 1,
          sections: {
            create: template.sections.map((section) => ({
              templateSectionId: section.id,
              fieldValues: {
                create: section.fields.map((field) => ({
                  templateFieldId: field.id,
                  value: '',
                })),
              },
            })),
          },
        },
      });

      // Get max orderIndex to append at end
      const items = await tx.sectionDocketItem.findMany({
        where: { sectionDocketId: id },
      });
      const maxOrderIndex = items.length > 0
        ? Math.max(...items.map((item) => item.orderIndex))
        : -1;

      // Create SectionDocketItem linking to child document
      const docketItem = await tx.sectionDocketItem.create({
        data: {
          sectionDocketId: id,
          itemType: 'HBMP_DOC',
          title: childTitle,
          refId: childDocument.id,
          orderIndex: maxOrderIndex + 1,
        },
      });

      return { childDocument, docketItem };
    });

    // Return child document and created item
    res.status(201).json({
      document: result.childDocument,
      item: result.docketItem,
    });
  } catch (error: any) {
    console.error('Error creating child document:', error);
    res.status(500).json({
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create child document',
        details: error.message,
      },
    });
  }
};


