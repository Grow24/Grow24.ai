import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const getAttachments = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    const attachments = await prisma.attachment.findMany({
      where: { documentId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ attachments });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch attachments',
        details: error.message,
      },
    });
  }
};

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'File is required',
        },
      });
    }

    const attachment = await prisma.attachment.create({
      data: {
        documentId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        storagePath: file.path,
        uploadedBy: 'system', // Fake user for v1
      },
    });

    res.status(201).json(attachment);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload attachment',
        details: error.message,
      },
    });
  }
};

export const downloadAttachment = async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Attachment not found',
        },
      });
    }

    if (!fs.existsSync(attachment.storagePath)) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'File not found on disk',
        },
      });
    }

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${attachment.fileName}"`
    );

    const fileStream = fs.createReadStream(attachment.storagePath);
    fileStream.pipe(res);
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'DOWNLOAD_ERROR',
        message: 'Failed to download attachment',
        details: error.message,
      },
    });
  }
};

