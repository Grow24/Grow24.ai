@echo off
cd /d "%~dp0"
echo Starting Frontend Server...
npx vite --host
pause

