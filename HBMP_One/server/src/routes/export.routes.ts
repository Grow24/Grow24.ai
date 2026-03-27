import { Router } from 'express';
import { exportDocument, exportToGoogleDoc, exportToGoogleSheets } from '../controllers/export.controller';

const router = Router();

router.get('/:documentId/export', exportDocument);
router.post('/:documentId/export/google-doc', exportToGoogleDoc);
router.post('/:documentId/export/google-sheets', exportToGoogleSheets);

export default router;

