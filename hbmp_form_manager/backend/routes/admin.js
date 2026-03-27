import express from 'express';
import googleSheetsService from '../services/googleSheets.js';
import googleDriveService from '../services/googleDrive.js';

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
 * GET /api/admin/tests
 * Get all test sheets from the spreadsheet
 */
router.get('/tests', validateToken, async (req, res) => {
    try {
        const tests = await googleSheetsService.getAllTests();
        res.json({
            ok: true,
            tests,
            count: tests.length,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to fetch tests',
            error: error.message,
        });
    }
});

/**
 * GET /api/admin/questions
 * Get all questions with enhanced format: id, section, order, type, text, required,
 * options[{text,imageUrl}], imageUrl, constraints, timerSeconds
 * Query params: sheetName (optional, defaults to 'Questions')
 */
router.get('/questions', validateToken, async (req, res) => {
    try {
        const { sheetName } = req.query;
        const questions = await googleSheetsService.getQuestions(sheetName);

        // Group by section for better organization
        const sections = {};
        questions.forEach(q => {
            const sectionName = q.section || 'Uncategorized';
            if (!sections[sectionName]) {
                sections[sectionName] = [];
            }
            sections[sectionName].push(q);
        });

        res.json({
            ok: true,
            questions,
            sections,
            count: questions.length,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to fetch questions',
            error: error.message,
        });
    }
});

/**
 * GET /api/admin/form-meta
 * Get form metadata from the FormMeta sheet
 */
router.get('/form-meta', validateToken, async (req, res) => {
    try {
        const meta = await googleSheetsService.getFormMeta();
        res.json({
            ok: true,
            meta,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to fetch form metadata',
            error: error.message,
        });
    }
});

/**
 * GET /api/admin/respondent-details
 * Get respondent details configuration
 */
router.get('/respondent-details', validateToken, async (req, res) => {
    try {
        const response = await googleSheetsService.sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetsService.spreadsheetId,
            range: 'RespondentDetails!A1:Z100',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.json({ ok: true, fields: [] });
        }

        const headers = rows[0];
        const fields = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const field = {};

            headers.forEach((header, index) => {
                field[header] = row[index] || '';
            });

            if (field.Field && field.Field.trim() !== '') {
                fields.push(field);
            }
        }

        // Sort by Order
        fields.sort((a, b) => {
            const orderA = parseInt(a.Order) || 0;
            const orderB = parseInt(b.Order) || 0;
            return orderA - orderB;
        });

        res.json({
            ok: true,
            fields,
            count: fields.length,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to fetch respondent details',
            error: error.message,
        });
    }
});

/**
 * POST /api/admin/preview
 * Generate a preview of the form without deploying
 * Body: { spreadsheetId?, sheetName? }
 * Returns: { ok:true, assessment:{ sections:[...], questions:[...] }, stats:{...}, errors:[...] }
 */
router.post('/preview', validateToken, async (req, res) => {
    try {
        const { sheetName } = req.body;
        const questions = await googleSheetsService.getQuestions(sheetName);
        const meta = await googleSheetsService.getFormMeta();
        const errors = [];

        // Get respondent details
        const rdResponse = await googleSheetsService.sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetsService.spreadsheetId,
            range: 'RespondentDetails!A1:Z100',
        });

        const rdRows = rdResponse.data.values;
        const respondentFields = [];

        if (rdRows && rdRows.length > 1) {
            const headers = rdRows[0];
            for (let i = 1; i < rdRows.length; i++) {
                const row = rdRows[i];
                const field = {};
                headers.forEach((header, index) => {
                    field[header] = row[index] || '';
                });
                if (field.Field && field.Field.trim() !== '') {
                    respondentFields.push(field);
                }
            }
            respondentFields.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0));
        }

        // Validate questions and collect errors
        questions.forEach((q, index) => {
            if (!q.text) {
                errors.push(`Question ${index + 1}: Missing question text`);
            }
            if (['MCQ', 'CHECKBOX', 'DROPDOWN'].includes(q.type) && q.options.length === 0) {
                errors.push(`Question ${q.id}: Type ${q.type} requires options`);
            }
        });

        // Group questions by section
        const sectionMap = {};
        questions.forEach(q => {
            const sectionName = q.section || 'Uncategorized';
            if (!sectionMap[sectionName]) {
                sectionMap[sectionName] = {
                    title: sectionName,
                    questions: [],
                };
            }
            sectionMap[sectionName].questions.push(q);
        });

        const sections = Object.values(sectionMap);

        // Calculate stats
        const stats = {
            totalQuestions: questions.length,
            totalSections: sections.length,
            respondentFieldsCount: respondentFields.length,
            questionsByType: {},
            questionsBySection: {},
            questionsWithImages: questions.filter(q => q.imageUrl).length,
            optionsWithImages: questions.reduce((sum, q) =>
                sum + q.options.filter(opt => opt.imageUrl).length, 0
            ),
        };

        questions.forEach((q) => {
            stats.questionsByType[q.type] = (stats.questionsByType[q.type] || 0) + 1;
            const section = q.section || 'Uncategorized';
            stats.questionsBySection[section] = (stats.questionsBySection[section] || 0) + 1;
        });

        res.json({
            ok: true,
            assessment: {
                meta,
                respondentFields,
                sections,
                questions, // Flat list for easier processing
            },
            stats,
            errors,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to generate preview',
            error: error.message,
        });
    }
});

/**
 * POST /api/admin/upload-image
 * Upload an image to Google Drive and write URL back to sheet
 * Body: { questionId, targetType: "QUESTION"|"OPTION", optionIndex?, fileName, mimeType, base64Data }
 */
router.post('/upload-image', validateToken, async (req, res) => {
    try {
        const { questionId, targetType, optionIndex, fileName, mimeType, base64Data, sheetName } = req.body;

        // Validate input
        if (!questionId || !targetType || !fileName || !mimeType || !base64Data) {
            return res.status(400).json({
                ok: false,
                message: 'Missing required fields: questionId, targetType, fileName, mimeType, base64Data',
            });
        }

        if (targetType === 'OPTION' && (optionIndex === null || optionIndex === undefined)) {
            return res.status(400).json({
                ok: false,
                message: 'optionIndex is required when targetType is OPTION',
            });
        }

        // Upload to Drive
        const uploadResult = await googleDriveService.uploadBase64ImageToFolder({
            base64Data,
            fileName,
            mimeType,
            folderId: process.env.DRIVE_FOLDER_ID,
        });

        // Write URL back to sheet
        await googleSheetsService.updateImageUrl(
            questionId,
            uploadResult.directLink, // Use direct link for embedding
            targetType,
            optionIndex,
            sheetName
        );

        res.json({
            ok: true,
            imageUrl: uploadResult.directLink,
            webViewLink: uploadResult.webViewLink,
            fileId: uploadResult.fileId,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to upload image',
            error: error.message,
        });
    }
});

/**
 * POST /api/admin/publish
 * Generate a NEW Google Form (versioned) and save metadata
 * Body: { formTitle?, formDescription? }
 * Returns: { ok:true, formId, editUrl, publishedUrl, version, createdAt }
 */
router.post('/publish', validateToken, async (req, res) => {
    try {
        const { formTitle, formDescription, sheetName } = req.body;
        const targetSheet = sheetName || 'Questions';

        // Get current metadata
        const meta = await googleSheetsService.getFormMeta();

        // Get respondent details
        const rdResponse = await googleSheetsService.sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetsService.spreadsheetId,
            range: 'RespondentDetails!A1:Z100',
        });

        const rdRows = rdResponse.data.values;
        const respondentFields = [];

        if (rdRows && rdRows.length > 1) {
            const headers = rdRows[0];
            for (let i = 1; i < rdRows.length; i++) {
                const row = rdRows[i];
                const field = {};
                headers.forEach((header, index) => {
                    field[header] = row[index] || '';
                });
                if (field.FieldName && field.FieldName.trim() !== '') {
                    respondentFields.push(field);
                }
            }
            respondentFields.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0));
        }

        // Get questions
        const questions = await googleSheetsService.getQuestions(targetSheet);

        if (questions.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No questions found. Please add questions before publishing.',
            });
        }

        // Import googleFormsService dynamically
        const googleFormsServiceModule = await import('../services/googleForms.js');
        const googleFormsService = googleFormsServiceModule.default;

        // Create the Google Form with test name in title
        const defaultTitle = targetSheet === 'Questions' 
            ? 'HBMP Assessment Form' 
            : `HBMP Assessment Form - ${targetSheet}`;
        
        const formResult = await googleFormsService.createForm({
            title: formTitle || meta.formTitle || defaultTitle,
            description: formDescription || meta.formDescription || '',
            respondentFields: respondentFields,
            questions: questions,
        });

        // Increment version
        const currentVersion = meta.version || 'v0.0';
        const versionNum = parseFloat(currentVersion.replace('v', '')) || 0;
        const newVersion = `v${(versionNum + 0.1).toFixed(1)}`;

        const createdAt = new Date().toISOString();

        // Update FormMeta sheet
        await googleSheetsService.updateFormMeta({
            lastFormId: formResult.formId,
            lastEditUrl: formResult.editUrl,
            lastPublishedUrl: formResult.publishedUrl,
            version: newVersion,
            lastDeployedAt: createdAt,
            formTitle: formTitle || meta.formTitle || 'HBMP Assessment Form',
            responseSpreadsheetId: formResult.responseSpreadsheetId,
            responseSpreadsheetUrl: formResult.responseSpreadsheetUrl,
        });

        res.json({
            ok: true,
            formId: formResult.formId,
            editUrl: formResult.editUrl,
            publishedUrl: formResult.publishedUrl,
            responseSpreadsheetUrl: formResult.responseSpreadsheetUrl,
            version: newVersion,
            createdAt,
            stats: formResult.stats,
            message: 'Google Form created successfully!',
        });
    } catch (error) {
        console.error('Publish error:', error);
        res.status(500).json({
            ok: false,
            message: 'Failed to publish form',
            error: error.message,
        });
    }
});

/**
 * POST /api/admin/deploy (legacy endpoint, redirects to publish)
 */
router.post('/deploy', validateToken, async (req, res) => {
    // Redirect to publish endpoint
    return router.handle(
        Object.assign(req, { url: '/api/admin/publish', path: '/api/admin/publish' }),
        res
    );
});

/**
 * PUT /api/admin/form-meta
 * Update form metadata
 */
router.put('/form-meta', validateToken, async (req, res) => {
    try {
        const updates = req.body;
        await googleSheetsService.updateFormMeta(updates);
        res.json({
            ok: true,
            message: 'Form metadata updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to update form metadata',
            error: error.message,
        });
    }
});

export default router;

