# Quick Start Guide - HBMP Docs Platform

## ✅ Current Status
- **Backend**: ✅ Running on http://localhost:4000
- **Frontend**: ⚠️ Needs manual start

## 🚀 How to Start the Application

### Option 1: Manual Start (Recommended)

**Open TWO separate terminal windows:**

#### Terminal 1 - Backend:
```powershell
cd D:\HBMP_DOCS_PLATFORM\server
$env:PORT="4000"
$env:DATABASE_URL="file:./prisma/dev.db"
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:4000
📚 API available at http://localhost:4000/api
```

#### Terminal 2 - Frontend:
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Option 2: Use the PowerShell Script

```powershell
cd D:\HBMP_DOCS_PLATFORM
.\start-servers.ps1
```

## 🌐 Access the Application

Once both servers are running:
1. Open your browser
2. Go to: **http://localhost:5173**
3. Login with any email/password (fake auth for v1)
4. Create a project
5. Create a Business Case document

## 🔍 Troubleshooting

### "Connection Refused" Error

1. **Check if backend is running:**
   ```powershell
   curl http://localhost:4000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check if frontend is running:**
   ```powershell
   netstat -ano | findstr ":5173"
   ```
   Should show a LISTENING port

3. **Kill existing processes:**
   ```powershell
   Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
   Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
   ```

4. **Restart both servers** using the commands above

### Frontend Won't Start

1. Make sure you're in the client directory:
   ```powershell
   cd D:\HBMP_DOCS_PLATFORM\client
   ```

2. Reinstall dependencies:
   ```powershell
   npm install
   ```

3. Try running vite directly:
   ```powershell
   npx vite
   ```

## 📝 Notes

- Backend API: http://localhost:4000/api
- Frontend: http://localhost:5173
- Database: SQLite at `server/prisma/dev.db`
- Business Case template is pre-seeded

