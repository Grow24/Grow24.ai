import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const whiteboardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  data: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed.elements && Array.isArray(parsed.elements);
    } catch {
      return false;
    }
  }, 'Invalid whiteboard data format'),
});

// GET /api/whiteboards - List all whiteboards
router.get('/', async (req, res, next) => {
  try {
    const whiteboards = await prisma.whiteboard.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(whiteboards);
  } catch (error) {
    next(error);
  }
});

// GET /api/whiteboards/:id - Get specific whiteboard
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id },
    });
    
    if (!whiteboard) {
      return res.status(404).json({ error: 'Whiteboard not found' });
    }
    
    res.json(whiteboard);
  } catch (error) {
    next(error);
  }
});

// POST /api/whiteboards - Create new whiteboard
router.post('/', async (req, res, next) => {
  try {
    const validatedData = whiteboardSchema.parse(req.body);
    
    const whiteboard = await prisma.whiteboard.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        data: validatedData.data,
        ownerId: 'default-user', // TODO: Replace with actual user ID from auth
      },
    });
    
    res.status(201).json(whiteboard);
  } catch (error) {
    next(error);
  }
});

// PUT /api/whiteboards/:id - Update whiteboard
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = whiteboardSchema.parse(req.body);
    
    const whiteboard = await prisma.whiteboard.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        data: validatedData.data,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
    });
    
    res.json(whiteboard);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/whiteboards/:id - Delete whiteboard
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.whiteboard.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;