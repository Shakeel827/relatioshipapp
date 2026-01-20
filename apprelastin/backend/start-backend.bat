@echo off
REM Set PATH to include Node.js
set PATH=C:\Program Files\nodejs;%PATH%

REM Navigate to backend
cd /d C:\Users\sksha\dev\apprelastin\backend

echo.
echo ================================================================
echo Starting Relastin Backend Server...
echo ================================================================
echo.

npm run dev

pause
