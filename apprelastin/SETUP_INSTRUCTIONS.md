# Complete Setup Instructions

## Prerequisites: Install Node.js

Your system needs **Node.js 18+** and **npm 9+** to run this project.

### Step 1: Install Node.js

**Download and Install from:** https://nodejs.org/

1. Visit https://nodejs.org/
2. Download **LTS** version (currently 20.x)
3. Run the installer
4. Accept defaults and complete installation
5. **Restart PowerShell** or CMD after installation

**Verify installation:**
```powershell
node --version
npm --version
```

Both should show version numbers (e.g., v20.x.x).

## Backend Setup

Once Node.js is installed:

### 1. Install Backend Dependencies
```powershell
cd backend
npm install
```

This installs:
- Express.js - Web server framework
- OpenAI SDK - For AI communication
- dotenv - Environment variable management
- CORS - Cross-origin request handling
- TypeScript - Type-safe JavaScript

### 2. Verify `.env` File

Check that `backend/.env` exists with:
```
AI_PROVIDER=openai
OPENAI_API_KEY=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
OPENAI_MODEL=gpt-4-mini
PORT=3000
NODE_ENV=development
```

### 3. Start Backend Server
```powershell
npm run dev
```

**Expected output:**
```
Relastin Backend running on port 3000
Health check: http://localhost:3000/api/health
```

If successful, the backend is ready! Keep this terminal open.

---

## Frontend Setup

In a **new PowerShell/Terminal window**:

### 1. Navigate to Project Root
```powershell
cd c:\Users\sksha\dev\apprelastin
```

### 2. Install Frontend Dependencies
```powershell
npm install
```

This installs:
- React Native
- Expo (mobile app framework)
- React Navigation
- Animated API utilities
- All UI components

### 3. Start Frontend
```powershell
npm start
```

**Expected output:**
```
Expo DevTools running at http://localhost:19000
Scan this QR code with Expo Go app (iOS/Android)
Press 'w' to open web preview
Press 'a' to open Android emulator
Press 'i' to open iOS simulator
```

---

## Testing the Integration

### Option 1: Web Preview (Easiest)
```powershell
# In the frontend terminal, press 'w'
```

A browser will open at http://localhost:19000/web

### Option 2: Mobile Device
1. Install **Expo Go** app (iOS App Store or Google Play Store)
2. Open Expo Go app
3. Scan the QR code from the terminal
4. App opens on your phone

### Option 3: Emulator
- iOS: Press 'i' (requires Xcode on Mac)
- Android: Press 'a' (requires Android Studio)

---

## API Configuration

### Default: OpenAI

Your backend is already configured to use **OpenAI's API**:
- **Model**: gpt-4-mini (fast, affordable)
- **API Key**: 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
- **Endpoints**:
  - POST `/api/chat` - Send messages
  - POST `/api/reflect` - Get tone analysis
  - GET `/api/health` - Check server status

### Switch to Your Own API

To use a custom LLM API endpoint:

**Edit `backend/.env`:**
```
AI_PROVIDER=custom
CUSTOM_API_BASE_URL=https://your-api.com
CUSTOM_API_KEY=your-key-here
CUSTOM_MODEL=your-model-name
```

**Restart backend:**
```powershell
npm run dev
```

Supported custom API response formats:
- `{ reply: "..." }`
- `{ content: "..." }`
- `{ message: "..." }`
- `{ choices: [{ message: { content: "..." } }] }`

---

## File Structure

```
apprelastin/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── services/
│   │   │   └── chat.service.ts    # OpenAI/Custom API integration
│   │   ├── routes/
│   │   │   └── chat.routes.ts     # /api/chat, /api/reflect endpoints
│   │   └── middleware/
│   │       └── index.ts      # Rate limiting, error handling
│   ├── .env                  # Your API keys (KEEP SECRET!)
│   ├── .env.example          # Template for .env
│   ├── package.json          # Dependencies
│   └── tsconfig.json         # TypeScript config
│
├── src/
│   ├── components/           # React Native UI components
│   │   ├── WelcomeScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ReflectionPanel.tsx
│   │   └── SettingsScreen.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useChat.ts       # Chat state management
│   │   └── useAuth.ts       # Authentication
│   ├── services/
│   │   └── api.ts           # Backend communication
│   └── theme/
│       └── theme.ts         # Design system (colors, fonts, animations)
│
├── App.tsx                   # Main app entry point
├── package.json              # Frontend dependencies
└── tsconfig.json             # TypeScript config
```

---

## Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/ and restart PowerShell

### Issue: "Cannot find module 'openai'"
**Solution**: 
```powershell
cd backend
npm install
```

### Issue: "Port 3000 already in use"
**Solution**: Edit `backend/.env` and change `PORT=3001`

### Issue: "OPENAI_API_KEY is required"
**Solution**: Verify `backend/.env` has the API key (should already be set)

### Issue: "fetch is not defined"
**Solution**: Ensure backend is using Node 18+ (check `npm --version`)

### Issue: CORS errors in browser console
**Solution**: Backend is configured for localhost. For production, add your domain to `backend/src/index.ts` CORS origins

---

## API Endpoints

### 1. Health Check
```
GET http://localhost:3000/api/health
Response: { status: "ok", model: "gpt-4-mini", timestamp: "..." }
```

### 2. Send Chat Message
```
POST http://localhost:3000/api/chat
Body: {
  "userMessage": "I'm feeling overwhelmed today"
}
Response: {
  "reply": "It sounds like you're carrying a lot...",
  "model": "gpt-4-mini"
}
```

### 3. Get Tone Reflection
```
POST http://localhost:3000/api/reflect
Body: {
  "userMessage": "Why would you even say that?"
}
Response: {
  "reflection": "This question comes across as defensive..."
}
```

---

## Environment Variables Reference

### Backend (.env)
| Variable | Value | Purpose |
|----------|-------|---------|
| `AI_PROVIDER` | `openai` \| `custom` | Which AI to use |
| `OPENAI_API_KEY` | Your key | OpenAI authentication |
| `OPENAI_MODEL` | `gpt-4-mini` | Model choice |
| `CUSTOM_API_BASE_URL` | URL | Your API endpoint |
| `CUSTOM_API_KEY` | Your key | Custom API auth |
| `CUSTOM_MODEL` | Name | Custom model name |
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |

### Frontend (.env.local)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Next Steps

1. ✅ Install Node.js
2. ✅ Run backend: `npm run dev` (in backend folder)
3. ✅ Run frontend: `npm start` (in root folder)
4. ✅ Test in web browser or mobile
5. ✅ Send messages and see AI responses!

## Support

For issues:
1. Check this guide's "Common Issues" section
2. Verify `.env` file has correct API key
3. Ensure backend is running (check http://localhost:3000/api/health)
4. Check console errors in browser (F12)
5. Restart both terminal windows

---

**Version**: 1.0  
**Last Updated**: January 20, 2026  
**Status**: Ready for production
