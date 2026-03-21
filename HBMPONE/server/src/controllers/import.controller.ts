import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { extractDocumentId, fetchGoogleDocContent, fetchGoogleSheetContent, fetchGoogleSlidesContent } from '../services/googleDocs.service';
import { parseStructuredContent, mapContentToFields } from '../services/contentParser.service';

const prisma = new PrismaClient();

interface ImportItem {
  type: 'GOOGLE_DOC' | 'GOOGLE_SHEET' | 'GOOGLE_SLIDE' | 'LINK' | 'FILE';
  url?: string;
  attachmentId?: string;
  rawText?: string;
  title?: string;
  accessToken?: string; // Google OAuth access token
}

interface ImportRequest {
  documentId: string;
  sectionIds: string[]; // Support multiple sections
  imports: ImportItem[];
  mode: 'LINK_ONLY' | 'AUTO_FILL';
  accessToken?: string; // Global access token for Google APIs
}

/**
 * POST /api/import
 * Import documents/links and optionally auto-fill section fields
 * body: { documentId, sectionIds, imports: [{type, url?, attachmentId?, rawText?, title?, accessToken?}], mode, accessToken? }
 */
export const importDocuments = async (req: Request, res: Response) => {
  try {
    const { documentId, sectionIds, imports, mode, accessToken: globalAccessToken }: ImportRequest = req.body;

    // Support both old format (sectionId) and new format (sectionIds)
    const sectionIdsArray = sectionIds || (req.body.sectionId ? [req.body.sectionId] : []);

    if (!documentId || !sectionIdsArray.length || !Array.isArray(imports) || !mode) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'documentId, sectionIds array, imports array, and mode are required',
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
              where: { id: { in: sectionIdsArray } },
              include: {
                fields: true,
              },
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

    const sections = document.template.sections.filter((s) => sectionIdsArray.includes(s.id));
    if (sections.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'No matching sections found in template',
        },
      });
    }

    // Process each section - create/get dockets and import items
    const docketResults: any[] = [];
    const allFieldValueUpdates: Array<{ fieldValueId: string; value: string }> = [];

    for (const section of sections) {
      // Get or create section docket for this section
      let docket = await prisma.sectionDocket.findUnique({
        where: {
          documentId_sectionId: {
            documentId,
            sectionId: section.id,
          },
        },
        include: { items: true },
      });

      if (!docket) {
        docket = await prisma.sectionDocket.create({
          data: {
            documentId,
            sectionId: section.id,
            title: section.title,
            status: 'ACTIVE',
          },
          include: { items: true },
        });
      }

      // Process imports for this section
      const createdItems = [];

      for (const importItem of imports) {
        // Determine item type
        let itemType: string;
        let itemUrl: string | null = null;
        let itemRefId: string | null = null;
        let itemAttachmentId: string | null = null;
        let itemTitle: string = importItem.title || 'Imported Item';

        switch (importItem.type) {
          case 'GOOGLE_DOC':
            itemType = 'GOOGLE_DOC';
            itemUrl = importItem.url || null;
            if (!itemUrl) {
              continue; // Skip if no URL
            }
            break;
          case 'GOOGLE_SHEET':
            itemType = 'GOOGLE_SHEET';
            itemUrl = importItem.url || null;
            if (!itemUrl) {
              continue;
            }
            break;
          case 'GOOGLE_SLIDE':
            itemType = 'GOOGLE_SLIDE';
            itemUrl = importItem.url || null;
            if (!itemUrl) {
              continue;
            }
            break;
          case 'LINK':
            itemType = 'LINK';
            itemUrl = importItem.url || null;
            if (!itemUrl) {
              continue;
            }
            break;
          case 'FILE':
            itemType = 'FILE';
            itemAttachmentId = importItem.attachmentId || null;
            if (!itemAttachmentId) {
              continue;
            }
            // Get attachment to get file name for title
            const attachment = await prisma.attachment.findUnique({
              where: { id: itemAttachmentId },
            });
            if (attachment) {
              itemTitle = attachment.fileName;
            }
            break;
          default:
            continue; // Skip unknown types
        }

        // Get max orderIndex
        const maxOrderIndex = docket.items.length > 0
          ? Math.max(...docket.items.map((item) => item.orderIndex))
          : -1;

        // Create docket item
        const item = await prisma.sectionDocketItem.create({
          data: {
            sectionDocketId: docket.id,
            itemType,
            title: itemTitle,
            refId: itemRefId,
            url: itemUrl,
            attachmentId: itemAttachmentId,
            orderIndex: maxOrderIndex + createdItems.length + 1,
          },
        });

        // If AUTO_FILL mode, try to extract and fill fields
        if (mode === 'AUTO_FILL') {
          let contentText = '';

          // Fetch content from Google APIs if URL and access token provided
          if (importItem.url && (importItem.accessToken || globalAccessToken)) {
            const accessToken = importItem.accessToken || globalAccessToken!;
            const docId = extractDocumentId(importItem.url);

            if (docId) {
              try {
                if (importItem.type === 'GOOGLE_DOC') {
                  contentText = await fetchGoogleDocContent(docId, accessToken);
                } else if (importItem.type === 'GOOGLE_SHEET') {
                  contentText = await fetchGoogleSheetContent(docId, accessToken);
                } else if (importItem.type === 'GOOGLE_SLIDE') {
                  contentText = await fetchGoogleSlidesContent(docId, accessToken);
                }
              } catch (error: any) {
                console.error(`Failed to fetch content from Google: ${error.message}`);
                // Fall back to rawText if provided
                contentText = importItem.rawText || '';
              }
            }
          } else if (importItem.rawText) {
            // Use provided raw text
            contentText = importItem.rawText;
          }

          // Parse and map content to fields if we have content
          if (contentText) {
            const parsedContent = parseStructuredContent(contentText);
            const fieldMapping = mapContentToFields(parsedContent, section.fields);

            // Find section instance
            const sectionInstance = await prisma.sectionInstance.findFirst({
              where: {
                documentId,
                templateSectionId: section.id,
              },
              include: {
                fieldValues: true,
              },
            });

            if (sectionInstance) {
              // Apply field mappings
              for (const [fieldId, content] of fieldMapping.entries()) {
                const fieldValue = sectionInstance.fieldValues.find((fv) => fv.templateFieldId === fieldId);
                if (fieldValue) {
                  // Only update if field is currently empty
                  const currentValue = fieldValue.value || '';
                  if (!currentValue.trim() && content.trim()) {
                    allFieldValueUpdates.push({
                      fieldValueId: fieldValue.id,
                      value: content.trim().substring(0, 5000), // Increased limit for better content
                    });
                  }
                }
              }
            }
          }
        }
      }

      docketResults.push({
        sectionId: section.id,
        docket,
        createdItems,
      });
    }

    // Update field values if any
    if (allFieldValueUpdates.length > 0) {
      await Promise.all(
        allFieldValueUpdates.map((update) =>
          prisma.fieldValue.update({
            where: { id: update.fieldValueId },
            data: { value: update.value },
          })
        )
      );
    }

    // Return updated dockets
    const updatedDockets = await Promise.all(
      docketResults.map((result) =>
        prisma.sectionDocket.findUnique({
          where: { id: result.docket.id },
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        })
      )
    );

    res.status(201).json({
      dockets: updatedDockets,
      totalItemsCreated: docketResults.reduce((sum, r) => sum + r.createdItems.length, 0),
      fieldValueUpdates: allFieldValueUpdates.length,
    });
  } catch (error: any) {
    console.error('Error importing documents:', error);
    res.status(500).json({
      error: {
        code: 'IMPORT_ERROR',
        message: 'Failed to import documents',
        details: error.message,
      },
    });
  }
};
