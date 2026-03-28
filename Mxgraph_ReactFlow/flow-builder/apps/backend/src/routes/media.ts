import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Upload media file (simplified for demo)
router.post('/upload', async (req, res, next) => {
  try {
    // For demo purposes, create a mock file upload
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        kind: 'image',
        name: 'Demo Image',
        mimeType: 'image/jpeg',
        url: 'https://via.placeholder.com/300x200',
        sizeBytes: 12345,
        createdBy: 'demo'
      }
    });

    res.json(mediaAsset);
  } catch (error) {
    next(error);
  }
});

// Create link media asset
router.post('/link', async (req, res, next) => {
  try {
    const { url } = z.object({ url: z.string().url() }).parse(req.body);
    
    const meta = {
      title: 'Demo Link',
      description: 'This is a demo link preview',
      image: 'https://via.placeholder.com/150x100',
      siteName: new URL(url).hostname
    };

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        kind: 'link',
        name: meta.title,
        url,
        meta: JSON.stringify(meta),
        createdBy: 'demo'
      }
    });

    res.json(mediaAsset);
  } catch (error) {
    next(error);
  }
});

// Create text media asset
router.post('/text', async (req, res, next) => {
  try {
    const { content, title } = z.object({
      content: z.string(),
      title: z.string().optional()
    }).parse(req.body);

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        kind: 'text',
        name: title || 'Rich Text',
        url: '', // Text content stored in meta
        meta: JSON.stringify({ content }),
        createdBy: req.body.userId || 'anonymous'
      }
    });

    res.json(mediaAsset);
  } catch (error) {
    next(error);
  }
});

export default router;