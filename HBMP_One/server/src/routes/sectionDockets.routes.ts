import { Router } from 'express';
import {
  createSectionDocket,
  getSectionDocketBySection,
  addSectionDocketItem,
  reorderSectionDocketItems,
  deleteSectionDocketItem,
  createChildDocInSectionDocket,
} from '../controllers/sectionDockets.controller';

const router = Router();

// POST /api/section-dockets
// Create a section docket (idempotent)
router.post('/', createSectionDocket);

// GET /api/section-dockets/by-section?documentId=xxx&sectionId=yyy
// Get section docket by documentId and sectionId
router.get('/by-section', getSectionDocketBySection);

// POST /api/section-dockets/:id/items
// Add an item to a section docket
router.post('/:id/items', addSectionDocketItem);

// PUT /api/section-dockets/:id/items/reorder
// Reorder items in a section docket
router.put('/:id/items/reorder', reorderSectionDocketItems);

// DELETE /api/section-dockets/items/:itemId
// Delete a section docket item
router.delete('/items/:itemId', deleteSectionDocketItem);

// POST /api/section-dockets/:id/create-child-doc
// Create a child DocumentInstance and link it as an item
router.post('/:id/create-child-doc', createChildDocInSectionDocket);

export default router;


