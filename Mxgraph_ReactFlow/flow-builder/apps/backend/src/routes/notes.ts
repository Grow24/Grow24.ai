import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createNoteSchema = z.object({
  flowId: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  color: z.string().optional(),
  content: z.string(),
  authorId: z.string()
});

const updateNoteSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  color: z.string().optional(),
  content: z.string().optional()
});

// GET /api/notes?flowId=123
router.get('/', async (req, res) => {
  try {
    const flowId = parseInt(req.query.flowId as string);
    if (!flowId) return res.status(400).json({ error: 'flowId required' });

    const notes = await prisma.stickyNote.findMany({
      where: { flowId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const data = createNoteSchema.parse(req.body);
    
    const note = await prisma.stickyNote.create({
      data
    });

    res.status(201).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const data = updateNoteSchema.parse(req.body);
    
    const note = await prisma.stickyNote.update({
      where: { id: req.params.id },
      data
    });

    res.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.stickyNote.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;