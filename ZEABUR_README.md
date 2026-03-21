# 🚀 Grow24.ai - Zeabur Deployment Ready

Clean repository prepared for production deployment on Zeabur.

## ⚡ Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Backend is deployed separately
# Configure VITE_API_ENDPOINT to point to your deployed backend
```

### Build for Production

```bash
# Frontend
npm run build

# Backend (no build needed - Node.js native)
```

## 🌐 Deploy to Zeabur

### One-Click Deployment

1. Visit [Zeabur Dashboard](https://dashboard.zeabur.com)
2. Create new project
3. Connect GitHub repository
4. **Frontend:** deploy with the **root `Dockerfile`** (port **8080**), not plain static hosting — Caddy serves `/`, `/univer/`, and `/HBMPONE/` from **`Caddyfile`**. See **[DEPLOY_ZEABUR.md](./DEPLOY_ZEABUR.md)**.
5. Set environment variables (see below)
6. Deploy!

### Required Environment Variables

**Frontend** (`VITE_*` prefix):

```env
VITE_API_ENDPOINT=https://your-backend.zeabur.app/api/chat
# HBMPONE client (build-time): full URL of HBMP API, e.g. https://your-hbmp-api.zeabur.app/api
# VITE_API_URL=https://your-hbmp-api.zeabur.app/api
# Optional: set explicitly for Contact Us → Send Email (defaults to same host as above)
# VITE_SEND_EMAIL_ENDPOINT=https://your-backend.zeabur.app/api/send-email
VITE_WHATSAPP_NUMBER=+91 9370239600
```

**Backend** (Deployed separately - configure these in your backend deployment):

Your backend **must** expose `POST /api/send-email` for the Contact Us "Send Email" feature. If you see "Cannot POST /api/send-email", redeploy the backend from the codebase that includes this route (e.g. PBMP backend with the send-email endpoint).

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
WAPI_API_KEY=your_wapi_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@grow24.ai
NODE_ENV=production
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md)** - What was cleaned
- **[README.md](./README.md)** - Original project documentation

## ✅ Pre-Deployment Checklist

- ✅ Repository cleaned (500MB+ reduced)
- ✅ No node_modules included
- ✅ Configuration files ready
- ✅ Environment templates provided
- ✅ CORS configured
- ✅ TypeScript strict mode
- ✅ Tailwind CSS optimized

## 🔧 Technology Stack

### Frontend

- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.11
- TanStack Router & Query
- Framer Motion
- Tailwind CSS
- React Three Fiber (3D Background)

### Backend

- Express.js 5.2.1
- Google Gemini AI
- AstraDB (LangChain)
- CORS enabled

## 📱 Features

- ✨ 3D Glassmorphic UI
- 💬 PBMP AI Chatbot with Gemini
- 📞 WhatsApp Integration
- 🔗 Social Media Links (Draggable)
- 📊 Interactive Solutions Grid
- 🎯 Resource Hub with Faceted Search
- 🎨 Modern Design System

## 🚨 Important Notes

1. **Do NOT commit `.env` files** - Use environment variables in Zeabur
2. **Node.js >=18.0.0** required
3. **API keys must be added in Zeabur dashboard**, not in code
4. **CORS is pre-configured** for common origins

## 📞 Support

For deployment issues:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review Zeabur logs in dashboard
3. Verify environment variables are set
4. Check GitHub integration

---

**Ready to deploy?** 🎉 Head to [Zeabur Dashboard](https://dashboard.zeabur.com) and connect this repository!
