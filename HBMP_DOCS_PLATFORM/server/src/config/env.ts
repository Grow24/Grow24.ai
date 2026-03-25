// Debug: Log environment variables on startup (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Environment Variables Check:');
  console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : '❌ MISSING');
  console.log('  GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ MISSING');
  console.log('  GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || 'Using default');
}

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/google/oauth/callback',
  // Note: The redirect URI must match what's configured in Google Cloud Console
  // It should point to: http://localhost:4000/google/oauth/callback
};

