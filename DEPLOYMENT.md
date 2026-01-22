# Grow24.ai - Deployment Guide for Zeabur

## Project Structure

```
├── src/                          # Frontend (React + TypeScript)
│   ├── components/              # React components
│   │   ├── pbmp/               # PBMP Chatbot components
│   │   ├── PBMPChatbot.tsx      # Main chatbot wrapper
│   │   └── FloatingWidgets.tsx  # WhatsApp, social links
│   ├── routes/                 # TanStack Router pages
│   ├── services/               # API services (chatService)
│   └── index.css               # Tailwind styles
└── public/                      # Static assets
```

## Deployment on Zeabur

### Option 1: Deploy Frontend Only (Recommended)

The frontend is a Vite + React app that can be deployed as a static site or serverless function.

1. **Connect GitHub Repository**
   - Go to Zeabur dashboard
   - Click "New Project"
   - Select GitHub repository (Grow24)
   - Choose "Import Git Repository"

2. **Build Settings**
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add in Zeabur dashboard:

   ```
   VITE_API_ENDPOINT=<your-backend-url>/api/chat
   VITE_WHATSAPP_NUMBER=+91 9370239600
   ```

4. **Deploy**
   - Click deploy
   - Zeabur will automatically build and deploy

### Option 2: Backend Deployment

The backend is deployed separately. Configure the frontend to connect to your deployed backend by setting the `VITE_API_ENDPOINT` environment variable.

## Environment Variables Setup

### Frontend (.env)

```env
VITE_API_ENDPOINT=https://your-backend.zeabur.app/api/chat
VITE_WHATSAPP_NUMBER=+91 9370239600
```

### Backend (Deployed Separately)

The backend is deployed separately. Ensure your backend has the following environment variables configured:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_API_ENDPOINT=your_astra_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_astra_token
WAPI_API_KEY=your_wapi_key
NODE_ENV=production
```

## Pre-Deployment Checklist

- [x] All node_modules cleaned (already removed)
- [x] Environment variables configured
- [x] Backend CORS configured for production domains
- [x] Frontend build optimized
- [x] No .env files in repository (in .gitignore)
- [x] package.json dependencies updated
- [x] TypeScript compilation passes

## Post-Deployment

1. **Test Frontend**: Visit https://your-frontend.zeabur.app
2. **Test Chatbot**: Click chatbot button and send message
3. **Test WhatsApp**: Click WhatsApp icon
4. **Monitor Logs**: Check Zeabur dashboard for errors

## Troubleshooting

### CORS Errors

- Update backend server.js allowedOrigins with your Zeabur domain
- Ensure frontend is using correct API endpoint

### API Not Responding

- Check backend environment variables are set correctly
- Verify GEMINI_API_KEY and AstraDB credentials (for chatbot)
- Check backend logs in Zeabur dashboard

### Build Failures

- Clear cache: `npm cache clean --force`
- Delete package-lock.json and reinstall
- Check Node version (requires >=18.0.0)

## Additional Resources

- [Zeabur Docs](https://docs.zeabur.com)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## Support

For issues or questions:

1. Check Zeabur logs
2. Review environment variables
3. Verify GitHub integration
4. Contact Zeabur support
