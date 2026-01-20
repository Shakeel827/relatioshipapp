@echo off
REM Set PATH to include Node.js
set PATH=C:\Program Files\nodejs;%PATH%

REM Navigate to frontend
cd /d C:\Users\sksha\dev\apprelastin

echo.
echo ================================================================
echo Starting Relastin Frontend App...
echo ================================================================
echo.
echo Waiting for backend to be ready...
echo (Make sure backend is running on port 3000)
echo.
echo When app opens, press 'w' for web preview
echo.

npm start

pause
