@echo off
REM ================================================================
REM Install Node.js v20 LTS for Windows
REM ================================================================

echo.
echo Installing Node.js v20 LTS...
echo.

REM Method 1: Using Chocolatey (if installed)
where choco >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Chocolatey found! Installing Node.js via Chocolatey...
    choco install nodejs -y
    goto done
)

REM Method 2: Download and run MSI installer
echo Downloading Node.js installer (this may take 1-2 minutes)...

REM Create temp folder
if not exist "%temp%\node-installer" mkdir "%temp%\node-installer"

REM Download Node.js
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi', '%temp%\node-installer\node.msi')"

if %ERRORLEVEL% NEQ 0 (
    echo Download failed. Please download Node.js manually from https://nodejs.org/
    pause
    exit /b 1
)

echo Running Node.js installer...
msiexec /i "%temp%\node-installer\node.msi" /quiet /norestart

:done
echo.
echo ================================================================
echo Node.js installation complete!
echo.
echo Next steps:
echo 1. CLOSE this Command Prompt
echo 2. Open a NEW Command Prompt
echo 3. Run: node --version
echo 4. Should show: v20.x.x
echo.
echo Then run your app:
echo   cd backend
echo   npm install
echo   npm run dev
echo ================================================================
pause
