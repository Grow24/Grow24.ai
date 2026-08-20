import { Router } from 'express';
import { createProject, getProjects, getProjectById, updateProject } from '../controllers/projects.controller';

const router = Router();

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:projectId', getProjectById);
router.patch('/:projectId', updateProject);
router.get('/:projectId/dockets', async (req, res) => {
  // Will be implemented in controller
  res.json({ dockets: [] });
});

export default router;

