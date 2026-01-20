#!/usr/bin/env pwsh
# ===================================================================
# RELASTIN PLATFORM - COMPLETE SETUP & LAUNCH SCRIPT
# ===================================================================
# This script will guide you through setting up and launching the
# entire Relastin platform (backend + frontend)
# ===================================================================

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║                  🚀 RELASTIN QUICK LAUNCH 🚀                  ║
║          Emotionally Intelligent Communication App             ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "📋 PREREQUISITES CHECK" -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = & node --version 2>&1
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js NOT installed!" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   Install LTS version (v20+)" -ForegroundColor Yellow
    Write-Host "   Restart PowerShell after installation" -ForegroundColor Yellow
    exit 1
}

# Check npm
try {
    $npmVersion = & npm --version 2>&1
    Write-Host "✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm NOT installed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n⚙️  SETUP OPTIONS" -ForegroundColor Yellow
Write-Host "1. Setup Backend Only"
Write-Host "2. Setup Frontend Only"
Write-Host "3. Setup Both (Recommended)"
$option = Read-Host "Choose option (1-3)"

if ($option -eq "1" -or $option -eq "3") {
    Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Cyan
    
    cd backend
    Write-Host "   Installing dependencies..." -ForegroundColor Gray
    npm install
    
    if ($?) {
        Write-Host "`n✅ Backend ready!" -ForegroundColor Green
        Write-Host "   To start backend, run: npm run dev" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Backend setup failed!" -ForegroundColor Red
        exit 1
    }
    
    cd ..
}

if ($option -eq "2" -or $option -eq "3") {
    Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Cyan
    
    Write-Host "   Installing dependencies..." -ForegroundColor Gray
    npm install
    
    if ($?) {
        Write-Host "`n✅ Frontend ready!" -ForegroundColor Green
        Write-Host "   To start frontend, run: npm start" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Frontend setup failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n
╔════════════════════════════════════════════════════════════════╗
║                    🎉 SETUP COMPLETE! 🎉                      ║
╚════════════════════════════════════════════════════════════════╝

📚 NEXT STEPS:

1️⃣  Start Backend (Terminal 1):
    cd backend
    npm run dev
    ✅ Backend runs on: http://localhost:3000

2️⃣  Start Frontend (Terminal 2):
    npm start
    ✅ Frontend runs on: http://localhost:19000
    Press 'w' for web preview

3️⃣  Test the app:
    - Open app in browser or mobile
    - Send a message
    - Watch AI respond! 🤖

📖 DOCUMENTATION:
   - Setup Guide: SETUP_INSTRUCTIONS.md
   - Quick Start: QUICK_REFERENCE.md
   - API Config: API_KEY_SETUP.md
   - Architecture: ARCHITECTURE.md

🔑 API CONFIGURATION:
   ✅ OpenAI: Already configured!
   📝 API Key: sk-or-v1-89cf6...
   📝 Model: gpt-4-mini

🎛️  CUSTOMIZE:
   - Edit: backend/.env
   - Change OPENAI_MODEL to use different models
   - Or set AI_PROVIDER=custom for your own API

💡 QUICK TIPS:
   - Use semicolons: cmd1; cmd2; cmd3 (not &&)
   - Port 3000 busy? Edit backend/.env PORT=3001
   - Need help? See SETUP_INSTRUCTIONS.md

🚀 Ready to launch? Start the commands above!
" -ForegroundColor Cyan

Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host
