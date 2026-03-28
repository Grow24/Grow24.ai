import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const templateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  previewImage: z.string().optional(),
  json: z.string(),
  tags: z.array(z.string()).default([])
});

// GET /api/science-templates
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    const where: any = {};
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { name: { contains: q as string } },
        { description: { contains: q as string } }
      ];
    }

    const templates = await prisma.sciTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(templates.map(t => ({
      ...t,
      tags: JSON.parse(t.tags)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/science-templates/:id
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.sciTemplate.findUnique({
      where: { id: req.params.id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      ...template,
      tags: JSON.parse(template.tags),
      json: JSON.parse(template.json)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST /api/science-templates
router.post('/', async (req, res) => {
  try {
    const data = templateSchema.parse(req.body);
    
    const template = await prisma.sciTemplate.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags)
      }
    });

    res.json({
      ...template,
      tags: JSON.parse(template.tags)
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid template data' });
  }
});

export default router;