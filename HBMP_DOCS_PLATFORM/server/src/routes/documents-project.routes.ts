import { Router } from 'express';
import {
  createDocument,
  getProjectDocuments,
} from '../controllers/documents.controller';

const router = Router();

// Routes that need /api prefix
router.post('/projects/:projectId/dockets/:docketId/documents', createDocument);
router.get('/projects/:projectId/documents', getProjectDocuments);

export default router;

