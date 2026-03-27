import { Router } from 'express';
import { importDocuments } from '../controllers/import.controller';

const router = Router();

// POST /api/import
// Import documents/links and optionally auto-fill section fields
router.post('/', importDocuments);

export default router;


