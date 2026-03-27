import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.join(__dirname, '../.oauth-tokens.json');

class OAuth2Service {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT_URI
        );

        // Load tokens if they exist
        this.loadTokens();

        console.log('✅ OAuth2 Service initialized');
    }

    /**
     * Generate authorization URL for user to grant access
     */
    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/forms.body', // Create and manage Google Forms
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent', // Force to get refresh token
        });
    }

    /**
     * Exchange authorization code for tokens
     */
    async getTokensFromCode(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            this.saveTokens(tokens);
            return { ok: true, tokens };
        } catch (error) {
            console.error('Error getting tokens:', error);
            throw error;
        }
    }

    /**
     * Save tokens to file
     */
    saveTokens(tokens) {
        try {
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
            console.log('✅ OAuth tokens saved');
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    }

    /**
     * Load tokens from file
     */
    loadTokens() {
        try {
            if (fs.existsSync(TOKEN_PATH)) {
                const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
                this.oauth2Client.setCredentials(tokens);
                console.log('✅ OAuth tokens loaded');
                return true;
            }
        } catch (error) {
            console.error('Error loading tokens:', error);
        }
        return false;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const credentials = this.oauth2Client.credentials;
        return !!(credentials && credentials.access_token);
    }

    /**
     * Get authenticated OAuth2 client
     */
    getAuthenticatedClient() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated. Please connect Google Drive first.');
        }
        return this.oauth2Client;
    }

    /**
     * Refresh access token if needed
     */
    async refreshAccessToken() {
        try {
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            this.oauth2Client.setCredentials(credentials);
            this.saveTokens(credentials);
            return credentials;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    /**
     * Revoke tokens and clear authentication
     */
    async revokeTokens() {
        try {
            await this.oauth2Client.revokeCredentials();
            if (fs.existsSync(TOKEN_PATH)) {
                fs.unlinkSync(TOKEN_PATH);
            }
            this.oauth2Client.setCredentials({});
            console.log('✅ OAuth tokens revoked');
        } catch (error) {
            console.error('Error revoking tokens:', error);
        }
    }
}

export default new OAuth2Service();


