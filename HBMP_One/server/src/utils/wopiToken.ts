import crypto from 'crypto';

const SECRET_KEY = process.env.WOPI_SECRET_KEY || 'dev-secret-key-change-in-production';

export interface UserInfo {
  userId: string;
  userName: string;
  userEmail: string;
}

/**
 * Generate a WOPI access token that encodes user information
 * In production, use JWT with proper signing
 */
export function generateWopiToken(userInfo: UserInfo): string {
  const payload = {
    userId: userInfo.userId,
    userName: userInfo.userName,
    userEmail: userInfo.userEmail,
    timestamp: Date.now(),
  };
  
  // Simple base64 encoding for MVP (use JWT in production)
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(encoded).digest('hex');
  
  return `${encoded}.${hmac}`;
}

/**
 * Decode and validate a WOPI access token
 */
export function decodeWopiToken(token: string): UserInfo | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    
    // Verify signature
    const expectedHmac = crypto.createHmac('sha256', SECRET_KEY).update(encoded).digest('hex');
    if (signature !== expectedHmac) return null;
    
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
    
    // Check token expiration (24 hours)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - payload.timestamp > maxAge) return null;
    
    return {
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
    };
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

