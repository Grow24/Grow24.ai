import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { level, code } = req.query;

    const where: any = { isActive: true };
    if (level) where.level = level;
    if (code) where.code = code;

    const templates = await prisma.documentTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({ templates });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch templates',
        details: error.message,
      },
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.documentTemplate.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            template: {
              orderBy: { order: 'asc' },
            },
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

    res.json(template);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch template',
        details: error.message,
      },
    });
  }
};

