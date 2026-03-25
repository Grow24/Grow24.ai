# 🚀 HBMP Docs Platform - START HERE

## ✅ Current Status
- **Backend**: ✅ Running on http://localhost:4000  
- **Frontend**: ⚠️ Needs to be started manually

## 📋 Quick Start Instructions

### Step 1: Start Backend (if not already running)

Open **Terminal/PowerShell** and run:

```powershell
cd D:\HBMP_DOCS_PLATFORM\server
$env:PORT="4000"
$env:DATABASE_URL="file:./prisma/dev.db"
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:4000
📚 API available at http://localhost:4000/api
```

### Step 2: Start Frontend

Open a **NEW Terminal/PowerShell** window and run:

**Option A - Using batch file (Easiest):**
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
.\start-frontend.bat
```

**Option B - Using npx directly:**
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
npx vite --host
```

**Option C - Using npm:**
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
npm run dev
```

**Expected output:**
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open in Browser

Once both servers are running:
1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the login page

## 🔍 Verify Servers Are Running

Run this command to check:
```powershell
netstat -ano | findstr ":4000 :5173"
```

You should see both ports showing "LISTENING"

## 🐛 Troubleshooting

### "Connection Refused" Error

1. **Make sure BOTH servers are running:**
   - Backend terminal should show "Server running on http://localhost:4000"
   - Frontend terminal should show "Local: http://localhost:5173/"

2. **Check ports are not blocked:**
   ```powershell
   netstat -ano | findstr ":4000 :5173"
   ```

3. **Try hard refresh in browser:**
   - Press `Ctrl + Shift + R` or `Ctrl + F5`

4. **Clear browser cache** if needed

### Frontend Won't Start

If `npm run dev` fails, try:
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
npx vite --host
```

This bypasses npm scripts and runs vite directly.

## 📝 Important Notes

- **Backend API**: http://localhost:4000/api
- **Frontend App**: http://localhost:5173
- **Database**: SQLite at `server/prisma/dev.db`
- **Login**: Use any email/password (fake auth for v1)

## 🎯 Next Steps After Login

1. Click "New Project" to create your first project
2. Click "Create Business Case" in the Business Case Docket
3. Fill in the sections using the rich text editor
4. Click "Export" to download as Word or PDF

---

**Need Help?** Check `QUICK_START.md` for more detailed instructions.

