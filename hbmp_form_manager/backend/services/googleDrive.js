import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import oauth2Service from './oauth2.js';

dotenv.config();

class GoogleDriveService {
    constructor() {
        this.auth = null;
        this.drive = null;
        this.folderId = process.env.DRIVE_FOLDER_ID;
        this.initialize();
    }

    async initialize() {
        try {
            // Create auth client from service account (fallback)
            this.auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                scopes: [
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/drive',
                ],
            });

            this.drive = google.drive({ version: 'v3', auth: this.auth });
            console.log('✅ Google Drive API initialized (Service Account)');
        } catch (error) {
            console.error('❌ Failed to initialize Google Drive API:', error.message);
            throw error;
        }
    }

    /**
     * Get Drive client with OAuth2 authentication (for personal accounts)
     */
    getOAuth2Drive() {
        const oauth2Client = oauth2Service.getAuthenticatedClient();
        return google.drive({ version: 'v3', auth: oauth2Client });
    }

    /**
     * Upload a base64 image to Google Drive using OAuth2 (for personal accounts)
     * @param {Object} options
     * @param {string} options.base64Data - Base64 encoded image data
     * @param {string} options.fileName - File name
     * @param {string} options.mimeType - MIME type (e.g., 'image/png')
     * @param {string} options.folderId - Drive folder ID (optional, uses env default)
     * @returns {Promise<{fileId: string, webViewLink: string, directLink: string}>}
     */
    async uploadBase64ImageToFolder({ base64Data, fileName, mimeType, folderId }) {
        try {
            // Check if OAuth2 is available, use it for personal accounts
            const useOAuth = oauth2Service.isAuthenticated();
            const drive = useOAuth ? this.getOAuth2Drive() : this.drive;

            const targetFolderId = folderId || this.folderId;

            if (!targetFolderId) {
                throw new Error('DRIVE_FOLDER_ID not configured in environment');
            }

            // Remove data URI prefix if present (e.g., "data:image/png;base64,")
            const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
            
            // Convert base64 to buffer
            const buffer = Buffer.from(base64Content, 'base64');
            
            // Create a readable stream from buffer
            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);

            // Upload file to Drive
            const fileMetadata = {
                name: fileName,
                parents: [targetFolderId],
            };

            const media = {
                mimeType: mimeType,
                body: bufferStream,
            };

            console.log(`📤 Uploading image using ${useOAuth ? 'OAuth2' : 'Service Account'}...`);

            const file = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, webViewLink',
            });

            const fileId = file.data.id;
            const webViewLink = file.data.webViewLink;

            // Set public read permission
            await this.setPublicReadPermission(fileId, drive);

            // Generate proxy link through our backend to avoid CORS issues
            // Format: http://localhost:5001/api/images/{fileId}
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
            const directLink = `${backendUrl}/api/images/${fileId}`;

            console.log(`✅ Image uploaded successfully: ${fileId}`);
            console.log(`📷 Proxy link: ${directLink}`);

            return {
                fileId,
                webViewLink,
                directLink,
            };
        } catch (error) {
            console.error('Error uploading to Drive:', error);
            throw error;
        }
    }

    /**
     * Set public read permission on a file
     * @param {string} fileId - The Drive file ID
     * @param {object} drive - Optional Drive client (uses OAuth2 or default)
     */
    async setPublicReadPermission(fileId, drive = null) {
        try {
            const driveClient = drive || this.drive;
            await driveClient.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            console.log(`✅ Public read permission set for file ${fileId}`);
        } catch (error) {
            console.error('Error setting permission:', error);
            throw error;
        }
    }

    /**
     * Delete a file from Drive (optional cleanup)
     * @param {string} fileId - The Drive file ID
     */
    async deleteFile(fileId) {
        try {
            await this.drive.files.delete({
                fileId: fileId,
            });
            console.log(`✅ File ${fileId} deleted`);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}

export default new GoogleDriveService();

