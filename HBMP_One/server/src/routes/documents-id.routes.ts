import { Router } from 'express';
import {
  getDocumentById,
  updateDocument,
  updateDocumentStatus,
} from '../controllers/documents.controller';

const router = Router();

// Routes that need /api/documents prefix
router.get('/:documentId', getDocumentById);
router.put('/:documentId', updateDocument);
router.post('/:documentId/status', updateDocumentStatus);

export default router;

