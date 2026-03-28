import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long')
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional()
});

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', asyncHandler(async (req: any, res: any) => {
  const projects = await prisma.project.findMany({
    include: {
      diagrams: {
        select: {
          id: true,
          name: true,
          kind: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  res.json({ projects });
}));

/**
 * GET /api/projects/:id
 * Get project by ID
 */
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      diagrams: {
        select: {
          id: true,
          name: true,
          kind: true,
          status: true,
          version: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  if (!project) {
    throw createError('Project not found', 404);
  }

  res.json({ project });
}));

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', asyncHandler(async (req: any, res: any) => {
  const validation = createProjectSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Invalid request data: ' + validation.error.issues.map(i => i.message).join(', '), 400);
  }

  const { name } = validation.data;

  const project = await prisma.project.create({
    data: { name }
  });

  res.status(201).json({ project });
}));

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const validation = updateProjectSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Invalid request data: ' + validation.error.issues.map(i => i.message).join(', '), 400);
  }

  const updateData = validation.data;

  // Check if project exists
  const existingProject = await prisma.project.findUnique({
    where: { id }
  });

  if (!existingProject) {
    throw createError('Project not found', 404);
  }

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  });

  res.json({ project });
}));

/**
 * DELETE /api/projects/:id
 * Delete project (and all diagrams)
 */
router.delete('/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  // Check if project exists
  const existingProject = await prisma.project.findUnique({
    where: { id },
    include: {
      diagrams: { select: { id: true } }
    }
  });

  if (!existingProject) {
    throw createError('Project not found', 404);
  }

  // Delete project (cascades to diagrams, audit events, exports)
  await prisma.project.delete({
    where: { id }
  });

  res.json({ 
    message: 'Project deleted successfully',
    deletedDiagrams: existingProject.diagrams.length
  });
}));

export { router as projectRoutes };