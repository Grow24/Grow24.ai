import express from 'express';
import { google } from 'googleapis';
import oauth2Service from '../services/oauth2.js';

const router = express.Router();

/**
 * GET /api/images/:fileId
 * Proxy endpoint to serve Google Drive images
 * This bypasses CORS issues by serving images through our backend
 */
router.get('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).send('File ID is required');
        }

        // Get OAuth2 authenticated client
        const authClient = oauth2Service.getAuthenticatedClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        // Get file metadata first to set proper content type
        const metadata = await drive.files.get({
            fileId: fileId,
            fields: 'mimeType, name',
        });

        // Get the file content
        const response = await drive.files.get(
            {
                fileId: fileId,
                alt: 'media',
            },
            { responseType: 'stream' }
        );

        // Set proper headers (don't set CORS headers manually, rely on global CORS middleware)
        res.setHeader('Content-Type', metadata.data.mimeType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

        // Pipe the image stream to response
        response.data
            .on('error', (err) => {
                console.error('Stream error:', err);
                if (!res.headersSent) {
                    res.status(500).send('Error streaming image');
                }
            })
            .pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Failed to load image');
    }
});

export default router;

