# ⚠️ CRITICAL: Node.js NOT Installed

## ❌ THE PROBLEM
```
node : The term 'node' is not recognized
npm : The term 'npm' is not recognized
```

**Your system doesn't have Node.js installed.**

---

## ✅ THE SOLUTION: Install Node.js Now

### Step 1: Download Node.js
👉 **Go to**: https://nodejs.org/
👉 **Click**: Download LTS (currently v20.x)
👉 **Version to get**: LTS (Long Term Support)

### Step 2: Install
1. Run the installer you just downloaded
2. Click "Next" through all screens
3. Accept the license agreement
4. **IMPORTANT**: Keep these checked:
   - ✅ Install for all users
   - ✅ Add to PATH (very important!)
5. Click "Finish"

### Step 3: Restart PowerShell
- Close ALL PowerShell windows
- Open a NEW PowerShell window

### Step 4: Verify Installation
```powershell
node --version
npm --version
```

Both should show version numbers like:
- v20.11.0 (or similar)
- 10.2.4 (or similar)

If you see version numbers, **Node.js is installed!** ✅

---

## 🚀 After Installation: Run Your App

### Terminal 1: Backend
```powershell
cd backend
npm install
npm run dev
```

### Terminal 2: Frontend (NEW PowerShell)
```powershell
npm install
npm start
```

---

## If Still Not Working After Installation

Try these troubleshooting steps:

### 1. Make sure PowerShell is NEWLY opened
```powershell
# Close all PowerShell windows first
# Open a brand new one
# Then try node --version
```

### 2. Try Command Prompt instead
```cmd
cd C:\Users\sksha\dev\apprelastin\backend
npm install
npm run dev
```

### 3. Or use PowerShell as Administrator
- Right-click PowerShell
- "Run as Administrator"
- Run commands again

### 4. Check if Node.js installed to the right location
```powershell
# Find Node.js installation
where node
where npm

# Should show paths like:
# C:\Program Files\nodejs\node.exe
# C:\Program Files\nodejs\npm.cmd
```

---

## ❓ Download Link Again
👉 **https://nodejs.org/** ← Download LTS version here

After installation, your app will run! 🚀
