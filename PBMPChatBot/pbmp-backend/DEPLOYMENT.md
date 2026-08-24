# 🚀 Deployment Guide - PBMP Backend with Email Integration

## ✅ Changes Made

1. **Added nodemailer integration** to [pbmp-backend/server.js](pbmp-backend/server.js)
2. **Updated /api/leads endpoint** with email functionality
3. **Installed nodemailer package**
4. **Created .env.example** with all required variables

## 📋 Required Environment Variables

Add these to your Zeabur deployment environment variables:

```
EMAIL_SERVICE=zoho
EMAIL_USER=your-zoho@grow24.ai
EMAIL_PASSWORD=your-zoho-app-password
EMAIL_FROM=Grow24 <your-zoho@grow24.ai>
ZOHO_REGION=com
```

`EMAIL_FROM` should be the same Zoho mailbox (or an allowed alias). Do not use a Gmail address.

If the mailbox is on Zoho India, set `ZOHO_REGION=in`. For Zoho Workplace / Mail Plus custom domain, also set `ZOHO_SMTP_PRO=true`.

## 🔧 Zeabur Deployment Steps

### Required Zeabur Variables

```env
GEMINI_API_KEY=<your_key>
GEMINI_MODEL=gemini-2.5-flash
```

> **Important:** If `GEMINI_MODEL=gemini-2.0-flash` is set in Zeabur Variables, chat will fail with 404 even after redeploy. Remove it or set `gemini-2.5-flash`.

### Option 1: Using Zeabur Dashboard

1. **Login to Zeabur**: https://zeabur.com
2. **Go to your PBMP Backend service** (pbmpchatbotbackend.zeabur.app)
3. **Navigate to Environment Variables**
4. **Add the email variables**:
   - `EMAIL_SERVICE` = `zoho`
   - `EMAIL_USER` = company Zoho mailbox (full address)
   - `EMAIL_PASSWORD` = Zoho app password
   - `EMAIL_FROM` = same Zoho mailbox (or allowed alias)
   - `ZOHO_REGION` = `com` (or `in` / `eu` / `au`)
5. **Redeploy** your service

### Option 2: Using Git Push

If you have Zeabur connected to your Git repository:

1. **Commit the changes**:

```bash
cd /Users/abhinavrai/DST/PBMPChatBot/pbmp-backend
git add .
git commit -m "Add email integration to leads endpoint"
git push
```

2. **Add environment variables** in Zeabur dashboard (as shown in Option 1)

3. **Zeabur will auto-deploy** the new version

### Option 3: Manual Deployment

If deploying manually:

1. **Upload updated files** to Zeabur
2. **Install dependencies**: `npm install`
3. **Set environment variables** in Zeabur dashboard
4. **Start server**: `npm start`

## 🧪 Testing the Updated Endpoint

### Test with curl:

```bash
curl -X POST https://pbmpchatbotbackend.zeabur.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "website"
  }'
```

Expected Response:

```json
{
  "success": true,
  "message": "Thank you! We've sent you a confirmation email. Check your inbox!",
  "data": {
    "email": "test@example.com",
    "name": "Test User",
    "source": "website",
    "status": "new",
    "createdAt": "2026-01-22T..."
  }
}
```

## ✨ New Features

The updated endpoint now:

1. **Validates email addresses**
2. **Checks for duplicate leads** (updates existing, creates new)
3. **Sends welcome email** with branded HTML template
4. **Saves to AstraDB** (if configured)
5. **Handles errors gracefully** (returns success even if email/DB fails)
6. **Logs all activity** for debugging

## 📧 Email Template

The endpoint sends a beautiful HTML email with:

- Grow24.ai branding
- Welcome message
- Feature highlights
- CTA button to explore the platform
- Professional styling

## 🔍 Verification

After deployment, check logs for:

- `✅ Email server is ready to send messages`
- `✅ Welcome email sent to: user@example.com`
- `✅ New lead saved to AstraDB`

## ⚠️ Important Notes

- **Zoho App Password**: Use a Zoho Mail app password if 2FA is enabled (not the regular login password)
- **From address**: Must match the authenticated Zoho mailbox or an alias on that account
- **Rate Limits**: Zoho Mail has daily sending limits based on the plan
- **Testing**: Test `/api/send-email` and `/api/leads` after deployment to verify delivery

## 🆘 Troubleshooting

### Email not sending:

1. Check environment variables are set correctly (`EMAIL_USER`, `EMAIL_PASSWORD`, `ZOHO_REGION`)
2. Verify Zoho SMTP is allowed for that mailbox (IMAP/SMTP access + app password)
3. Confirm `EMAIL_FROM` matches the Zoho account
4. Check Zeabur logs for errors: `⚠️ Email sending error:`

### Database not saving:

1. Verify ASTRA_DB_API_ENDPOINT and ASTRA_DB_APPLICATION_TOKEN are set
2. Check collection 'leads' exists in AstraDB
3. Review logs for: `❌ Database save error:`

### CORS errors:

- Allowed origins are already configured in server.js
- Check request headers match allowed origins

## 📞 Support

If you encounter issues:

1. Check Zeabur deployment logs
2. Verify all environment variables are set
3. Test the endpoint with curl/Postman
4. Review server console output
