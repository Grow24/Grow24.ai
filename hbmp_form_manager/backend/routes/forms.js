import express from 'express';
import googleSheets from '../services/googleSheets.js';

const router = express.Router();

/**
 * POST /api/forms/deploy
 * Deploy a form version
 */
router.post('/deploy', async (req, res, next) => {
  try {
    const { version, notes } = req.body;

    // Get current questions and metadata
    const [questions, meta] = await Promise.all([
      googleSheets.getQuestions(),
      googleSheets.getFormMeta()
    ]);

    // Update metadata with deployment info
    const deploymentData = {
      Status: 'published',
      DeployedAt: new Date().toISOString(),
      Version: version || (parseInt(meta.Version || '0') + 1).toString(),
      DeploymentNotes: notes || ''
    };

    await googleSheets.updateFormMeta(deploymentData);

    // TODO: Save deployed version to database for history
    // TODO: Generate static form JSON for form viewer

    res.json({
      ok: true,
      message: 'Form deployed successfully',
      deployment: {
        version: deploymentData.Version,
        deployedAt: deploymentData.DeployedAt,
        questionsCount: questions.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/forms
 * List all deployed forms
 */
router.get('/', async (req, res, next) => {
  try {
    // TODO: Fetch from database
    // For now, return current form metadata
    
    const meta = await googleSheets.getFormMeta();
    
    res.json({
      ok: true,
      forms: [
        {
          id: '1',
          title: meta.FormTitle,
          version: meta.Version,
          status: meta.Status,
          deployedAt: meta.DeployedAt || null
        }
      ]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/forms/:id
 * Get specific deployed form
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get questions and metadata
    const [questions, meta] = await Promise.all([
      googleSheets.getQuestions(),
      googleSheets.getFormMeta()
    ]);

    // Group by sections
    const sections = {};
    questions.forEach(q => {
      const section = q.Section || 'General';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(q);
    });

    res.json({
      ok: true,
      form: {
        id,
        meta,
        sections,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/forms/:id/responses
 * Get form responses (future feature)
 */
router.get('/:id/responses', async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Implement response fetching from Forms API
    
    res.json({
      ok: true,
      message: 'Response fetching not yet implemented',
      formId: id,
      responses: []
    });
  } catch (error) {
    next(error);
  }
});

export default router;


