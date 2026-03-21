import { Router } from 'express';
import { createProject, getProjects, getProjectById } from '../controllers/projects.controller';

const router = Router();

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:projectId', getProjectById);
router.get('/:projectId/dockets', async (req, res) => {
  // Will be implemented in controller
  res.json({ dockets: [] });
});

export default router;

