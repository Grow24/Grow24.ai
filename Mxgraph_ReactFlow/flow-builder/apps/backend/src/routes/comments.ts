import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createCommentSchema = z.object({
  flowId: z.number(),
  anchorType: z.enum(['node', 'edge', 'canvas']),
  anchorId: z.string().optional(),
  content: z.string().min(1),
  authorId: z.string()
});

const updateCommentSchema = z.object({
  content: z.string().min(1).optional(),
  resolved: z.boolean().optional()
});

// GET /api/comments?flowId=123
router.get('/', async (req, res) => {
  try {
    const flowId = parseInt(req.query.flowId as string);
    if (!flowId) return res.status(400).json({ error: 'flowId required' });

    const comments = await prisma.diagramComment.findMany({
      where: { flowId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments
router.post('/', async (req, res) => {
  try {
    const data = createCommentSchema.parse(req.body);
    
    const comment = await prisma.diagramComment.create({
      data
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// PUT /api/comments/:id
router.put('/:id', async (req, res) => {
  try {
    const data = updateCommentSchema.parse(req.body);
    
    const comment = await prisma.diagramComment.update({
      where: { id: req.params.id },
      data
    });

    res.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.diagramComment.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;