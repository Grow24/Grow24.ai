import { Router } from 'express';
import {
  executeTransition,
  getWorkflowHistory,
  getAvailableTransitions,
} from '../controllers/workflow.controller';

const router = Router();

router.post('/:documentId/workflow/transition', executeTransition);
router.get('/:documentId/workflow/history', getWorkflowHistory);
router.get('/:documentId/workflow/transitions', getAvailableTransitions);

export default router;

