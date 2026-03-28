import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Create attachment
router.post('/', async (req, res, next) => {
  try {
    const { scope, scopeId, mediaId } = z.object({
      scope: z.string(),
      scopeId: z.string(),
      mediaId: z.string()
    }).parse(req.body);

    const attachment = await prisma.attachment.create({
      data: { scope, scopeId, mediaId },
      include: { media: true }
    });

    res.json(attachment);
  } catch (error) {
    next(error);
  }
});

// Get attachments by scope
router.get('/', async (req, res, next) => {
  try {
    const { scope, scopeId } = z.object({
      scope: z.string(),
      scopeId: z.string()
    }).parse(req.query);

    const attachments = await prisma.attachment.findMany({
      where: { scope, scopeId },
      include: { media: true },
      orderBy: { order: 'asc' }
    });

    res.json(attachments);
  } catch (error) {
    next(error);
  }
});

// Update attachment order
router.put('/:id/order', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order } = z.object({ order: z.number() }).parse(req.body);

    const attachment = await prisma.attachment.update({
      where: { id },
      data: { order },
      include: { media: true }
    });

    res.json(attachment);
  } catch (error) {
    next(error);
  }
});

// Delete attachment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.attachment.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;