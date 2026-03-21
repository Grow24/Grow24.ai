import { Request, Response } from 'express';
import { google } from 'googleapis';
import { config } from '../config/env';

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
export const initiateGoogleAuth = async (req: Request, res: Response) => {
  try {
    // Log the redirect URI being used for debugging
    console.log('Using redirect URI:', config.googleRedirectUri);
    console.log('Using client ID:', config.googleClientId ? `${config.googleClientId.substring(0, 20)}...` : 'MISSING');

    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );

    const scopes = [
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/presentations.readonly',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
    });

    console.log('Generated auth URL:', authUrl.substring(0, 100) + '...');
    res.json({ authUrl });
  } catch (error: any) {
    console.error('Error initiating Google auth:', error);
    res.status(500).json({
      error: {
        code: 'AUTH_ERROR',
        message: 'Failed to initiate Google authentication',
        details: error.message,
      },
    });
  }
};

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback - redirects to HTML page that posts message to parent
 */
export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const { code, error } = req.query;

    if (error) {
      // Send error to parent window via postMessage
      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_ERROR',
                  error: '${error}'
                }, window.location.origin);
                window.close();
              } else {
                document.body.innerHTML = '<h1>Authentication Error</h1><p>${error}</p>';
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_ERROR',
                  error: 'Authorization code is required'
                }, window.location.origin);
                window.close();
              } else {
                document.body.innerHTML = '<h1>Error</h1><p>Authorization code is required</p>';
              }
            </script>
          </body>
        </html>
      `);
    }

    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );

    const { tokens } = await oauth2Client.getToken(code as string);
    
    // Send token to parent window via postMessage
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                accessToken: '${tokens.access_token}',
                refreshToken: '${tokens.refresh_token || ''}',
                expiresIn: ${tokens.expiry_date || 'null'}
              }, window.location.origin);
              window.close();
            } else {
              document.body.innerHTML = '<h1>Authentication Successful</h1><p>You can close this window.</p>';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Error handling Google callback:', error);
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: '${error.message || 'Authentication failed'}'
              }, window.location.origin);
              window.close();
            } else {
              document.body.innerHTML = '<h1>Error</h1><p>${error.message || 'Authentication failed'}</p>';
            }
          </script>
        </body>
      </html>
    `);
  }
};

