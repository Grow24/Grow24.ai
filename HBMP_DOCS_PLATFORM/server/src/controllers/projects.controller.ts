import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_DOCKETS = [
  { name: 'Business Case Docket', type: 'BUSINESS_CASE', level: 'C' },
  { name: 'Business Requirements Docket', type: 'BUSINESS_REQUIREMENTS', level: 'C' },
  { name: 'Test Docket', type: 'TEST', level: 'I' },
];

async function ensureDefaultDockets(projectId: string) {
  const existing = await prisma.docket.findMany({ where: { projectId } });
  const missing = DEFAULT_DOCKETS.filter(
    (docket) => !existing.some((item) => item.type === docket.type)
  );
  if (missing.length === 0) return;
  await prisma.docket.createMany({
    data: missing.map((docket) => ({ ...docket, projectId })),
  });
}

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        dockets: true,
        documents: {
          select: {
            id: true,
            title: true,
            status: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch projects',
        details: error.message,
      },
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        dockets: {
          include: {
            documents: {
              include: {
                template: {
                  select: {
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    if (!project.dockets || project.dockets.length === 0) {
      await ensureDefaultDockets(projectId);
      const withDockets = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          dockets: {
            include: {
              documents: {
                include: {
                  template: {
                    select: {
                      name: true,
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return res.json(withDockets);
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch project',
        details: error.message,
      },
    });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, clientName } = req.body;

    if (!name) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Project name is required',
        },
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientName,
        status: 'ACTIVE',
        dockets: {
          create: [
            {
              name: 'Business Case Docket',
              type: 'BUSINESS_CASE',
              level: 'C',
            },
            {
              name: 'Business Requirements Docket',
              type: 'BUSINESS_REQUIREMENTS',
              level: 'C',
            },
            {
              name: 'Test Docket',
              type: 'TEST',
              level: 'I',
            },
          ],
        },
      },
      include: {
        dockets: true,
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create project',
        details: error.message,
      },
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, clientName, status } = req.body || {};
    const data: { name?: string; description?: string; clientName?: string; status?: string } = {};
    if (typeof name === 'string' && name.trim()) data.name = name.trim();
    if (typeof description === 'string') data.description = description;
    if (typeof clientName === 'string') data.clientName = clientName;
    if (status === 'ACTIVE' || status === 'ARCHIVED') data.status = status;

    const project = await prisma.project.update({
      where: { id: projectId },
      data,
      include: { dockets: true },
    });
    res.json(project);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Project not found' },
      });
    }
    res.status(500).json({
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update project',
        details: error.message,
      },
    });
  }
};

