# HBMP Docs Platform - Start Script
Write-Host "Starting HBMP Docs Platform..." -ForegroundColor Green

# Kill any existing processes on ports 4000 and 5173
Write-Host "`nCleaning up existing processes..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "`nStarting Backend Server (port 4000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\HBMP_DOCS_PLATFORM\server"
    $env:PORT = "4000"
    $env:DATABASE_URL = "file:./prisma/dev.db"
    $env:NODE_ENV = "development"
    npx tsx src/index.ts
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server (port 5173)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\HBMP_DOCS_PLATFORM\client"
    npm run dev
}

# Wait for servers to start
Start-Sleep -Seconds 5

# Check if servers are running
Write-Host "`nChecking server status..." -ForegroundColor Yellow
$backendRunning = (Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue) -ne $null
$frontendRunning = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue) -ne $null

if ($backendRunning) {
    Write-Host "✓ Backend is running on http://localhost:4000" -ForegroundColor Green
} else {
    Write-Host "✗ Backend failed to start" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "✓ Frontend is running on http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend failed to start" -ForegroundColor Red
}

if ($backendRunning -and $frontendRunning) {
    Write-Host "`n✓ Both servers are running!" -ForegroundColor Green
    Write-Host "`nOpen your browser and go to: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop both servers" -ForegroundColor Yellow
    
    # Keep script running and show logs
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Write-Host "`nStopping servers..." -ForegroundColor Yellow
        Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "`nSome servers failed to start. Check the output above." -ForegroundColor Red
    Write-Host "Backend logs:" -ForegroundColor Yellow
    Receive-Job $backendJob
    Write-Host "`nFrontend logs:" -ForegroundColor Yellow
    Receive-Job $frontendJob
}

