import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { projectId, docketId } = req.params;
    const { templateId, title } = req.body;

    if (!templateId || !title) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'templateId and title are required',
        },
      });
    }

    // Get template to derive level
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

    // Create document instance
    // Note: Workflow history will be created when first transition occurs
    const document = await prisma.documentInstance.create({
      data: {
        projectId,
        docketId,
        templateId,
        title,
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
      include: {
        template: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    res.status(201).json(document);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create document',
        details: error.message,
      },
    });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      include: {
        template: {
          include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
          },
        },
        sections: {
          include: {
            section: {
              include: {
                fields: true,
              },
            },
            fieldValues: {
              include: {
                field: true,
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

    // Transform to match API spec format
    const transformed = {
      id: document.id,
      title: document.title,
      projectId: document.projectId,
      docketId: document.docketId,
      templateId: document.templateId,
      status: document.status,
      version: document.version,
      level: document.level,
      template: {
        name: document.template.name,
        code: document.template.code,
        sections: document.template.sections.map((section) => {
          const sectionInstance = document.sections.find(
            (si) => si.templateSectionId === section.id
          );
          return {
            id: section.id,
            title: section.title,
            order: section.order,
            description: section.description,
            sectionInstanceId: sectionInstance?.id,
            fields: section.fields.map((field) => {
              const fieldValue = sectionInstance?.fieldValues.find(
                (fv) => fv.templateFieldId === field.id
              );
              return {
                id: field.id,
                label: field.label,
                dataType: field.dataType,
                mandatory: field.mandatory,
                helpText: field.helpText,
                fieldValueId: fieldValue?.id,
                value: fieldValue?.value || '',
              };
            }),
          };
        }),
      },
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    res.json(transformed);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch document',
        details: error.message,
      },
    });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { fieldValues, title } = req.body;

    // Update title if provided
    if (title) {
      await prisma.documentInstance.update({
        where: { id: documentId },
        data: { title },
      });
    }

    // Update field values
    if (fieldValues && Array.isArray(fieldValues)) {
      for (const fv of fieldValues) {
        if (fv.fieldValueId && fv.value !== undefined) {
          await prisma.fieldValue.update({
            where: { id: fv.fieldValueId },
            data: { value: fv.value },
          });
        }
      }
    }

    const updated = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update document',
        details: error.message,
      },
    });
  }
};

/**
 * Update document status directly (legacy endpoint)
 * NOTE: Prefer using /workflow/transition endpoint for proper workflow management
 * This endpoint is kept for backward compatibility but does not create workflow history
 */
export const updateDocumentStatus = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { status } = req.body;

    const validStatuses = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'SUPERSEDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        },
      });
    }

    const document = await prisma.documentInstance.update({
      where: { id: documentId },
      data: { status },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    res.json(document);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update document status',
        details: error.message,
      },
    });
  }
};

export const getProjectDocuments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const documents = await prisma.documentInstance.findMany({
      where: { projectId },
      include: {
        template: {
          select: {
            name: true,
            code: true,
          },
        },
        docket: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const transformed = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      templateId: doc.templateId,
      templateName: doc.template.name,
      docketId: doc.docketId,
      docketName: doc.docket.name,
      status: doc.status,
      level: doc.level,
      version: doc.version,
      updatedAt: doc.updatedAt,
    }));

    res.json({ documents: transformed });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch documents',
        details: error.message,
      },
    });
  }
};

