import express from 'express';
import googleSheets from '../services/googleSheets.js';

const router = express.Router();

/**
 * POST /api/preview
 * Generate preview data for admin dashboard
 */
router.post('/', async (req, res, next) => {
  try {
    // Get questions and metadata
    const [questions, meta] = await Promise.all([
      googleSheets.getQuestions(),
      googleSheets.getFormMeta()
    ]);

    // Group questions by section
    const sections = {};
    questions.forEach(q => {
      const section = q.Section || 'General';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(q);
    });

    // Sort sections and questions
    Object.keys(sections).forEach(section => {
      sections[section].sort((a, b) => {
        const orderA = parseFloat(a.Order) || 0;
        const orderB = parseFloat(b.Order) || 0;
        return orderA - orderB;
      });
    });

    // Generate preview data
    const previewData = {
      meta: {
        title: meta.FormTitle || 'Untitled Form',
        description: meta.FormDescription || '',
        version: meta.Version || '1',
        status: meta.Status || 'draft'
      },
      sections: sections,
      stats: {
        totalQuestions: questions.length,
        totalSections: Object.keys(sections).length,
        questionsByType: {}
      }
    };

    // Count questions by type
    questions.forEach(q => {
      const type = q.Type || 'TEXT';
      previewData.stats.questionsByType[type] = 
        (previewData.stats.questionsByType[type] || 0) + 1;
    });

    res.json({
      ok: true,
      preview: previewData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/preview/:versionId
 * Get preview for specific version (future feature)
 */
router.get('/:versionId', async (req, res, next) => {
  try {
    const { versionId } = req.params;
    
    // TODO: Implement version-specific preview
    // For now, return current version
    
    res.json({
      ok: true,
      message: 'Version-specific preview not yet implemented',
      versionId
    });
  } catch (error) {
    next(error);
  }
});

export default router;


