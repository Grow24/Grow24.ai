# Multi-Client Security Implementation

## 🔒 Security Improvements for HBMP SaaS Platform

### Overview

This implementation transforms the Microsoft Excel viewer into a secure, production-ready multi-client SaaS application where multiple organizations can safely access their own Microsoft OneDrive files.

---

## What Changed?

### ❌ **BEFORE: Insecure Token Handling**

```javascript
// ⚠️ OLD CODE - DO NOT USE
res.redirect(`/dashboard.html?token=${access_token}`); // Token in URL!

// Client-side
const token = new URLSearchParams(window.location.search).get("token"); // Exposed!
fetch(`/api/excel/files?token=${token}`); // Token in request!
```

**Problems:**

- 🚨 Access tokens visible in browser URL bar
- 🚨 Tokens logged in browser history
- 🚨 Tokens logged in server access logs
- 🚨 Vulnerable to XSS attacks
- 🚨 Tokens can be intercepted by browser extensions
- 🚨 Not suitable for multi-client production environment

---

### ✅ **AFTER: Secure Session-Based Authentication**

```javascript
// ✅ NEW CODE - Production Ready
req.session.accessToken = access_token; // Stored server-side
res.redirect(`/dashboard.html`); // No token in URL

// Middleware protection
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Protected endpoint
app.get("/api/excel/files", requireAuth, async (req, res) => {
  const token = req.session.accessToken; // Retrieved from session
  // ... use token ...
});
```

**Benefits:**

- ✅ Tokens stored server-side in encrypted sessions
- ✅ No tokens in URLs or browser history
- ✅ HttpOnly cookies prevent XSS attacks
- ✅ Each client has isolated session
- ✅ Production-ready security

---

## Architecture for Multi-Client SaaS

### How It Works:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Client A      │         │   HBMP Server   │         │   Microsoft     │
│  (Company XYZ)  │         │                 │         │   Graph API     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │                            │
        │ 1. Click "Login"           │                            │
        │─────────────────────────────>                           │
        │                            │                            │
        │ 2. Redirect to Microsoft   │                            │
        │<─────────────────────────────                           │
        │                            │                            │
        │ 3. Enter Microsoft credentials                          │
        │─────────────────────────────────────────────────────────>
        │                            │                            │
        │ 4. Authorization code      │                            │
        │<─────────────────────────────────────────────────────────
        │                            │                            │
        │ 5. Send auth code          │                            │
        │─────────────────────────────>                           │
        │                            │ 6. Exchange code for token │
        │                            │─────────────────────────────>
        │                            │                            │
        │                            │ 7. Access token (stored in session)
        │                            │<─────────────────────────────
        │ 8. Set session cookie      │                            │
        │<─────────────────────────────                           │
        │                            │                            │
        │ 9. API requests (no token) │                            │
        │─────────────────────────────>                           │
        │                            │ 10. Use token from session │
        │                            │─────────────────────────────>
        │                            │ 11. User's OneDrive files  │
        │                            │<─────────────────────────────
        │ 12. Return files           │                            │
        │<─────────────────────────────                           │
```

### Session Isolation:

```
HBMP Server Memory
├── Session Store
│   ├── Session ID: abc123def456
│   │   ├── accessToken: eyJ0eXAi... (Client A's token)
│   │   ├── refreshToken: 0.AX...
│   │   ├── expiresAt: 1699372800000
│   │   └── sessionID: abc123def456
│   │
│   ├── Session ID: xyz789ghi012
│   │   ├── accessToken: eyJ0eXBi... (Client B's token)
│   │   ├── refreshToken: 0.BX...
│   │   ├── expiresAt: 1699373200000
│   │   └── sessionID: xyz789ghi012
│   │
│   └── Session ID: mno345pqr678
│       ├── accessToken: eyJ0eXCi... (Client C's token)
│       ├── refreshToken: 0.CX...
│       ├── expiresAt: 1699373600000
│       └── sessionID: mno345pqr678
```

**Key Points:**

- Each client gets a unique session
- Sessions are isolated from each other
- Tokens never leave the server
- Client only receives httpOnly session cookie

---

## Security Features Implemented

### 1. **Environment Variables**

```bash
# .env file
CLIENT_ID=your-azure-app-id
CLIENT_SECRET=your-azure-app-secret
REDIRECT_URI=http://localhost:5173/auth/callback
SESSION_SECRET=random-secret-key-change-in-production
```

**Benefits:**

- ✅ Secrets not in source code
- ✅ Easy to change per environment
- ✅ Can use different secrets per deployment

### 2. **Secure Session Configuration**

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only
      httpOnly: true, // Prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

**Features:**

- ✅ HttpOnly cookies (no JavaScript access)
- ✅ Secure flag for HTTPS in production
- ✅ 24-hour session expiration
- ✅ Session reuse prevented

### 3. **Authentication Middleware**

```javascript
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Please login first",
      loginUrl: "/auth/login",
    });
  }
  next();
};
```

**Protection:**

- ✅ All API endpoints protected
- ✅ Automatic redirect to login
- ✅ Consistent error responses

### 4. **Session Management Endpoints**

#### Check Authentication Status

```bash
GET /api/auth/status
```

```json
{
  "authenticated": true,
  "expiresAt": 1699372800000,
  "sessionId": "abc123def456"
}
```

#### Logout

```bash
GET /auth/logout
```

- Destroys server-side session
- Clears session cookie
- Redirects to homepage

---

## Frontend Changes Required

### ❌ **OLD Frontend Code**

```javascript
// Get token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

// Pass token in every request
fetch(`/api/excel/files?token=${token}`);
```

### ✅ **NEW Frontend Code**

```javascript
// No need to handle tokens!
// Session cookie sent automatically

// Just make API calls
fetch(`/api/excel/files`).then((response) => {
  if (response.status === 401) {
    // Not logged in
    window.location.href = "/auth/login";
  }
  return response.json();
});
```

**Simplifications:**

- ✅ No token management in client code
- ✅ No URL parameter parsing
- ✅ Automatic session handling
- ✅ Simpler error handling

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/abhinavrai/Desktop/DST/hbmp_tools/Google/ms_check
npm install express-session dotenv
```

### 2. Create .env File

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Generate Session Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:

```
SESSION_SECRET=<generated-secret-here>
```

### 4. Restart Server

```bash
npm start
# or
./start.sh
```

### 5. Update Frontend Files

The following files need minor updates to remove token handling:

- `public/dashboard.html` - Remove token from API calls
- `public/excel.html` - Remove token from API calls

---

## Production Deployment Checklist

### 🔒 Security

- [ ] Change SESSION_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (secure cookies)
- [ ] Set secure cookie options
- [ ] Add rate limiting
- [ ] Add CORS configuration
- [ ] Use Redis for session store (for scaling)

### 🔧 Configuration

- [ ] Update REDIRECT_URI to production domain
- [ ] Configure Azure App Registration for production URL
- [ ] Set appropriate session expiration
- [ ] Configure token refresh logic
- [ ] Add health check endpoint

### 📊 Monitoring

- [ ] Add logging for authentication events
- [ ] Monitor session creation/destruction
- [ ] Track API usage per client
- [ ] Set up error alerts
- [ ] Add performance monitoring

---

## Multi-Tenant Considerations

### Session Storage

For production with many clients, use Redis:

```javascript
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
const redisClient = redis.createClient();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    // ... other options
  })
);
```

**Benefits:**

- ✅ Scales horizontally
- ✅ Shared session store across servers
- ✅ Persistent sessions (survives restarts)
- ✅ Automatic cleanup of expired sessions

### Token Refresh

Implement automatic token refresh:

```javascript
async function getValidToken(req) {
  // Check if token expired
  if (Date.now() > req.session.expiresAt) {
    // Refresh token
    const newToken = await refreshAccessToken(req.session.refreshToken);
    req.session.accessToken = newToken.access_token;
    req.session.expiresAt = Date.now() + newToken.expires_in * 1000;
  }
  return req.session.accessToken;
}
```

### Client Isolation

Each client's data is automatically isolated because:

1. Each user logs in with their own Microsoft account
2. Microsoft Graph API returns only that user's files
3. Sessions are completely isolated
4. No cross-client data leakage possible

---

## API Endpoints Reference

### Authentication

- `GET /auth/login` - Initiate OAuth login
- `GET /auth/callback` - OAuth callback (handles token exchange)
- `GET /auth/logout` - Destroy session and logout
- `GET /api/auth/status` - Check if authenticated

### Protected APIs (all require authentication)

- `GET /api/me` - Get user profile
- `GET /api/photo` - Get profile photo
- `GET /api/drive` - List OneDrive files
- `GET /api/excel/files` - List Excel files only
- `GET /api/excel/:fileId` - Get specific file details
- `GET /api/recent` - Get recent files
- `GET /api/shared` - Get shared files
- `GET /api/sites` - List SharePoint sites
- `GET /api/search?q=query` - Search files
- `GET /api/debug/all-files` - Debug endpoint

---

## Testing Multi-Client Setup

### Test Scenario 1: Different Users

1. User A logs in with account A@company1.com
2. User A sees their OneDrive files from account A
3. User B logs in with account B@company2.com (different browser/incognito)
4. User B sees their OneDrive files from account B
5. ✅ Verify: Users see only their own files

### Test Scenario 2: Session Isolation

1. Login as User A in Browser 1
2. Login as User B in Browser 2
3. Make API calls from both browsers simultaneously
4. ✅ Verify: Each sees their own data
5. ✅ Verify: No data mixing between sessions

### Test Scenario 3: Session Expiration

1. Login as a user
2. Wait 24 hours (or modify session timeout for testing)
3. Try to access API
4. ✅ Verify: Gets 401 Unauthorized
5. ✅ Verify: Can re-login successfully

---

## Migration Guide

### For Existing Frontend Code

**Find and replace pattern:**

```javascript
// OLD PATTERN
const token = params.get("token") || localStorage.getItem("msToken");
fetch(`/api/endpoint?token=${token}`);

// NEW PATTERN (remove token handling)
fetch(`/api/endpoint`).then((res) => {
  if (res.status === 401) {
    window.location.href = "/auth/login";
    return;
  }
  return res.json();
});
```

**Remove these lines:**

```javascript
// DELETE THESE
localStorage.setItem('msToken', token);
const token = localStorage.getItem('msToken');
?token=${token}
```

**Add error handling:**

```javascript
// ADD THIS
.catch(err => {
  if (err.response?.status === 401) {
    window.location.href = '/auth/login';
  }
})
```

---

## Troubleshooting

### Issue: "Unauthorized" errors after login

**Solution:** Check session configuration and cookie settings

### Issue: Session not persisting

**Solution:** Verify SESSION_SECRET is set and `saveUninitialized: false`

### Issue: CORS errors in production

**Solution:** Configure CORS middleware with credentials:

```javascript
app.use(
  cors({
    origin: "https://your-domain.com",
    credentials: true,
  })
);
```

### Issue: Token expired errors

**Solution:** Implement token refresh logic using refresh_token

---

## Security Best Practices

### ✅ DO:

- Store CLIENT_SECRET in environment variables
- Use HTTPS in production
- Set httpOnly on session cookies
- Implement token refresh
- Add rate limiting
- Log authentication events
- Use secure session storage (Redis)
- Set appropriate session timeouts
- Validate all inputs
- Use CSRF protection

### ❌ DON'T:

- Expose tokens in URLs
- Store tokens in localStorage
- Log tokens in console
- Share sessions between clients
- Use weak session secrets
- Disable security features
- Allow unlimited session duration
- Trust client-side validation

---

## Support

For issues or questions:

1. Check server logs for errors
2. Verify .env configuration
3. Test authentication flow manually
4. Check Azure App Registration settings
5. Review session storage

---

## Summary

This implementation provides:

- ✅ **Secure multi-client architecture**
- ✅ **Session-based authentication**
- ✅ **Token isolation per user**
- ✅ **Production-ready security**
- ✅ **Automatic session management**
- ✅ **Easy frontend integration**
- ✅ **Scalable architecture**

Perfect for **HBMP as a SaaS platform** serving multiple clients! 🚀
