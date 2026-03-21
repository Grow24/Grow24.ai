# Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank Page After Login

**Symptoms:** White/blank page after successful login

**Solutions:**
- Open browser DevTools (F12) → Console tab
- Look for red error messages
- Check Network tab to see if API calls are failing
- Verify backend is running: `curl http://localhost:4000/api/health`

**Common Causes:**
- Backend not running
- CORS issues
- API endpoint errors
- React component errors

### 2. Error When Clicking "Business Case Docket"

**Symptoms:** Error message or nothing happens when clicking sidebar item

**Possible Causes:**

#### A. Template Not Found
- **Check:** Browser console for "Business Case template or docket not found"
- **Solution:** Ensure database is seeded:
  ```powershell
  cd D:\HBMP_DOCS_PLATFORM\server
  $env:DATABASE_URL="file:./prisma/dev.db"
  npx tsx prisma/seed.ts
  ```

#### B. API Call Failing
- **Check:** Browser DevTools → Network tab
- Look for failed requests to `/api/templates` or `/api/projects/:id/dockets/:id/documents`
- **Solution:** Verify backend is running and accessible

#### C. Navigation Error
- **Check:** Browser console for routing errors
- **Solution:** Hard refresh browser (Ctrl+Shift+R)

### 3. "Create Business Case" Button Not Working

**Symptoms:** Clicking button shows error or does nothing

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click the button
4. Check for error messages

**Common Errors:**

#### Error: "Business Case template or docket not found"
- **Cause:** Database not seeded or template missing
- **Fix:** Run seed script (see above)

#### Error: "Network error" or "Failed to create Business Case"
- **Cause:** Backend not running or API endpoint wrong
- **Fix:** 
  - Check backend is running: `netstat -ano | findstr ":4000"`
  - Restart backend if needed
  - Check API URL in browser Network tab

### 4. Frontend Won't Start

**Symptoms:** `npm run dev` fails with vite errors

**Solution:**
```powershell
cd D:\HBMP_DOCS_PLATFORM\client
npx vite --host
```

This bypasses npm scripts and runs vite directly.

### 5. Backend Won't Start

**Symptoms:** Port 4000 already in use or other errors

**Solution:**
```powershell
# Kill process on port 4000
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }

# Start backend
cd D:\HBMP_DOCS_PLATFORM\server
$env:PORT="4000"
$env:DATABASE_URL="file:./prisma/dev.db"
npm run dev
```

## Debug Checklist

When reporting an error, please check:

- [ ] Backend is running (check terminal or `curl http://localhost:4000/api/health`)
- [ ] Frontend is running (check terminal or browser shows login page)
- [ ] Browser console errors (F12 → Console tab)
- [ ] Network requests (F12 → Network tab) - are API calls failing?
- [ ] Database is seeded (Business Case template exists)
- [ ] No port conflicts (4000 for backend, 5173 for frontend)

## Getting Help

If you're still stuck:

1. **Check browser console** (F12) for specific error messages
2. **Check backend terminal** for server errors
3. **Check Network tab** to see which API calls are failing
4. **Share the error message** from console or terminal

## Quick Fixes

### Reset Everything
```powershell
# Stop all processes
Get-NetTCPConnection -LocalPort 4000,5173 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

# Restart backend
cd D:\HBMP_DOCS_PLATFORM\server
$env:PORT="4000"; $env:DATABASE_URL="file:./prisma/dev.db"; npm run dev

# Restart frontend (in new terminal)
cd D:\HBMP_DOCS_PLATFORM\client
npx vite --host
```

### Verify Setup
```powershell
# Check backend
curl http://localhost:4000/api/health

# Check templates
curl http://localhost:4000/api/templates?level=C

# Check projects
curl http://localhost:4000/api/projects
```

