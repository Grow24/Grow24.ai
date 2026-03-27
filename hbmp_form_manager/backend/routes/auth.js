import express from 'express';
import oauth2Service from '../services/oauth2.js';

const router = express.Router();

/**
 * GET /api/auth/status
 * Check if user is authenticated with Google Drive
 */
router.get('/status', (req, res) => {
    const isAuthenticated = oauth2Service.isAuthenticated();
    res.json({
        ok: true,
        authenticated: isAuthenticated,
    });
});

/**
 * GET /api/auth/google
 * Initiate OAuth2 flow - redirect to Google consent screen
 */
router.get('/google', (req, res) => {
    try {
        const authUrl = oauth2Service.getAuthUrl();
        res.json({
            ok: true,
            authUrl,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to generate auth URL',
            error: error.message,
        });
    }
});

/**
 * GET /api/auth/google/callback
 * Handle OAuth2 callback from Google
 */
router.get('/google/callback', async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.send(`
            <html>
                <body>
                    <h1>❌ Authentication Failed</h1>
                    <p>Error: ${error}</p>
                    <p><a href="http://localhost:3000">Go back to Admin Panel</a></p>
                </body>
            </html>
        `);
    }

    if (!code) {
        return res.status(400).send('Missing authorization code');
    }

    try {
        await oauth2Service.getTokensFromCode(code);
        res.send(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        }
                        .container {
                            background: white;
                            padding: 40px;
                            border-radius: 10px;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                            text-align: center;
                            max-width: 400px;
                        }
                        h1 { color: #28a745; margin-bottom: 20px; }
                        p { color: #666; margin-bottom: 30px; }
                        a {
                            display: inline-block;
                            padding: 12px 24px;
                            background: #667eea;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: 600;
                        }
                        a:hover { background: #5568d3; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✅ Google Drive Connected!</h1>
                        <p>You can now upload images directly from the admin panel.</p>
                        <a href="http://localhost:3000">Go back to Admin Panel</a>
                    </div>
                    <script>
                        // Auto close after 3 seconds
                        setTimeout(() => {
                            window.close();
                        }, 3000);
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send(`
            <html>
                <body>
                    <h1>❌ Error</h1>
                    <p>${error.message}</p>
                    <p><a href="http://localhost:3000">Go back to Admin Panel</a></p>
                </body>
            </html>
        `);
    }
});

/**
 * POST /api/auth/disconnect
 * Disconnect Google Drive (revoke tokens)
 */
router.post('/disconnect', async (req, res) => {
    try {
        await oauth2Service.revokeTokens();
        res.json({
            ok: true,
            message: 'Google Drive disconnected successfully',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Failed to disconnect',
            error: error.message,
        });
    }
});

export default router;


