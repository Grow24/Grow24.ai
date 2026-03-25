import { Router } from 'express';
import {
  createDocument,
  getDocumentById,
  updateDocument,
  updateDocumentStatus,
  getProjectDocuments,
} from '../controllers/documents.controller';

const router = Router();

router.post('/projects/:projectId/dockets/:docketId/documents', createDocument);
router.get('/projects/:projectId/documents', getProjectDocuments);
router.get('/:documentId', getDocumentById);
router.put('/:documentId', updateDocument);
router.post('/:documentId/status', updateDocumentStatus);

export default router;

