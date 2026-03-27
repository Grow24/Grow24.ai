import express from 'express';
import googleSheetsService from '../services/googleSheets.js';

const router = express.Router();

/**
 * Middleware to validate secret token
 */
function validateToken(req, res, next) {
    const token = req.headers['x-secret-token'] || req.body.secretToken;
    const expectedToken = process.env.SECRET_TOKEN;

    if (!token || token !== expectedToken) {
        return res.status(401).json({
            ok: false,
            message: 'Unauthorized: Invalid or missing secret token',
        });
    }

    next();
}

/**
 * PUT /api/questions/:questionId
 * Update a question's text, options, or constraints
 */
router.put('/:questionId', validateToken, async (req, res) => {
    const { questionId } = req.params;
    const { text, options, type, constraints, sheetName } = req.body;
    
    try {
        console.log(`📝 Updating question ${questionId} in sheet ${sheetName}:`, { text, options, type, constraints });

        if (!questionId) {
            return res.status(400).json({
                ok: false,
                message: 'Question ID is required',
            });
        }

        const result = await googleSheetsService.updateQuestion(questionId, {
            text,
            options,
            type,
            constraints,
        }, sheetName);

        console.log(`✅ Question ${questionId} updated successfully in Google Sheets`);

        res.json({
            ok: true,
            message: 'Question updated successfully',
            result,
        });
    } catch (error) {
        console.error(`❌ Error updating question ${questionId}:`, error);
        res.status(500).json({
            ok: false,
            message: 'Failed to update question',
            error: error.message,
        });
    }
});

export default router;
