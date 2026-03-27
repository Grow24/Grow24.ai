import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getAttachments, uploadAttachment, downloadAttachment } from '../controllers/attachments.controller';

const router = Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/documents/:documentId/attachments', getAttachments);
router.post('/documents/:documentId/attachments', upload.single('file'), uploadAttachment);
router.get('/attachments/:attachmentId/download', downloadAttachment);

export default router;

