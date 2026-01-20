# ⚡ RELASTIN - QUICK REFERENCE CARD

**Cheat sheet for developers working on Relastin.**

---

## 🚀 5-MINUTE STARTUP

### Prerequisites
```powershell
# Install Node.js 18+ from https://nodejs.org/
# Then restart PowerShell and verify:
node --version  # Should show v18+
npm --version   # Should show 9+
```

### Terminal 1: Backend
```powershell
cd backend
npm install
npm run dev
# ✅ Backend running on http://localhost:3000
```

**Note**: Your `.env` file is already set up with the API key!

### Terminal 2: Frontend (new PowerShell window)
```powershell
npm install
npm start
# Press 'w' for web preview
# Or 'a'/'i' for mobile emulator
```

---

## 🔑 API Configuration

### Current Setup (OpenAI)
- ✅ API Key: Already configured in `backend/.env`
- ✅ Model: gpt-4-mini
- ✅ Ready to use!

### Switch to Custom API
Edit `backend/.env`:
```env
AI_PROVIDER=custom
CUSTOM_API_BASE_URL=https://your-api.com
CUSTOM_API_KEY=your-key
CUSTOM_MODEL=your-model
```

Then: `npm run dev`

---

## 🏗️ FILE SHORTCUTS

| What | Where | Edit For |
|------|-------|----------|
| Colors | `src/theme/theme.ts` | UI palette |
| Fonts | `src/theme/theme.ts` | Typography |
| Animations | `src/theme/theme.ts` | Speed/easing |
| AI Behavior | `backend/src/services/chat.service.ts` | System prompt |
| API Endpoints | `backend/src/routes/chat.routes.ts` | REST routes |
| Frontend Config | `.env.local` | Backend URL |
| Backend Config | `backend/.env` | OpenAI key |

---

## 📱 COMPONENTS QUICK LAUNCH

```typescript
// Import
import { 
  WelcomeScreen, 
  AuthScreen, 
  ChatScreen, 
  ReflectionPanel, 
  SettingsScreen 
} from "@/components";

// Use
<WelcomeScreen onComplete={() => {}} />
<AuthScreen mode="login" onSubmit={handleAuth} />
<ChatScreen messages={msgs} onSendMessage={send} />
<ReflectionPanel visible={show} message={msg} reflection={ref} />
<SettingsScreen onLogout={logout} />
```

---

## 🧠 HOOKS QUICK LAUNCH

```typescript
// Import
import { useChat, useAuth } from "@/hooks";

// Use Chat
const { messages, isLoading, sendMessage, getReflectionForMessage } = useChat();
await sendMessage("Hello!");
const reflection = await getReflectionForMessage("Your message");

// Use Auth
const { user, isSignedIn, signIn, signUp, signOut } = useAuth();
await signIn("email@test.com", "password");
await signUp("email@test.com", "password");
await signOut();
```

---

## 🔌 API ENDPOINTS

### Chat
```bash
POST /api/chat
Body: { "messages": [{ "role": "user", "content": "Hello" }] }
Response: { "reply": "...", "model": "gpt-4-mini" }
```

### Reflect
```bash
POST /api/reflect
Body: { "userMessage": "This is a message" }
Response: { "reflection": "..." }
```

### Health
```bash
GET /api/health
Response: { "status": "ok", "model": "...", "timestamp": "..." }
```

---

## 🎨 THEME QUICK REFERENCE

### Colors
```typescript
theme.colors.background      // #F8F7F5 (soft white)
theme.colors.paper           // #FFFFFF (white)
theme.colors.ink             // #2B2621 (dark)
theme.colors.blueDusk        // #6B7A9F (primary blue)
theme.colors.lavender        // #8B7FA8 (secondary)
```

### Spacing
```typescript
theme.spacing.sm   // 8
theme.spacing.md   // 12
theme.spacing.lg   // 16
theme.spacing.xl   // 24
theme.spacing.xxl  // 32
```

### Animation
```typescript
theme.motion.slow      // 1200ms
theme.motion.calm      // 850ms
theme.motion.gentle    // 650ms
theme.motion.micro     // 320ms
```

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (.env)
```
OPENAI_API_KEY=sk-...          # REQUIRED
OPENAI_MODEL=gpt-4-mini        # Optional
PORT=3000                      # Optional
```

### Frontend (.env.local)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api   # REQUIRED
```

---

## 🚨 COMMON TASKS

### Add a new screen
```typescript
// 1. Create src/screens/NewScreen.tsx
export const NewScreen = () => {
  return <View>Your content</View>;
};

// 2. Add to components/index.ts
export { NewScreen } from "../screens/NewScreen";

// 3. Import and use in navigation
import { NewScreen } from "@/components";
```

### Change primary color
```typescript
// In src/theme/theme.ts
blueDusk: "#YOUR_HEX_COLOR",   // Change this
```

### Modify AI prompt
```typescript
// In backend/src/services/chat.service.ts
const SYSTEM_PROMPT = `Your new prompt here...`;
```

### Increase animation speed
```typescript
// In src/theme/theme.ts
motion: {
  slow: 800,    // was 1200
  calm: 600,    // was 850
  gentle: 450,  // was 650
}
```

---

## 🐛 QUICK FIXES

| Problem | Solution |
|---------|----------|
| Backend won't start | Check port 3000: `lsof -i :3000` |
| Backend won't connect | Verify `http://localhost:3000/api` works |
| Slow OpenAI responses | Normal - cold calls take 2-3s |
| API key errors | Check `.env` has `OPENAI_API_KEY` |
| Can't find component | Check `src/components/index.ts` exports |
| Animation stuttering | Reduce animation duration in theme |

---

## 📊 PROJECT STRUCTURE

```
Frontend: src/
├── components/      → UI Components
├── hooks/           → State Management
├── services/        → API Client
├── theme/           → Design System
└── types/           → TypeScript Definitions

Backend: backend/src/
├── services/        → OpenAI Integration
├── routes/          → API Endpoints
├── middleware/      → Rate Limiting, Errors
└── index.ts         → Express Server
```

---

## 🧪 TESTING QUICK COMMANDS

### Test Backend
```bash
# Check health
curl http://localhost:3000/api/health

# Send message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Hello"}'

# Get reflection
curl -X POST http://localhost:3000/api/reflect \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "This is urgent!"}'
```

### Test Frontend
```bash
# Start with web for fast iteration
npm start
# Press 'w' for web browser

# Test on iOS
npm start
# Press 'i'

# Test on Android
npm start
# Press 'a'
```

---

## 📚 DOCUMENTATION MAP

- `README.md` ← You are here
- `GETTING_STARTED.md` ← Detailed setup
- `ARCHITECTURE.md` ← Technical deep dive
- `PLATFORM_SUMMARY.md` ← Overview
- `EXAMPLE_APP.tsx` ← Implementation example
- `backend/README.md` ← API docs
- `DELIVERABLES.md` ← What's included

---

## 🎯 DEPLOYMENT CHECKLIST

- [ ] Backend API key set
- [ ] Frontend API URL updated
- [ ] All tests passing
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] CORS properly set
- [ ] Rate limiting active
- [ ] Error handling in place

---

## ⚡ POWER USER TIPS

1. **Reload frontend:** Press `r` in Expo terminal
2. **View backend logs:** Check terminal where `npm run dev` runs
3. **Test with curl:** Verify API without running frontend
4. **Check API:** `http://localhost:3000` in browser
5. **Environment variables:** Restart both services when changed
6. **TypeScript errors:** Run `tsc --noEmit` to check
7. **Clean install:** `rm -rf node_modules && npm install`

---

## 🚀 DEPLOY IN 5 STEPS

### Backend
1. `cd backend && npm run build`
2. Push to Heroku/Railway/AWS
3. Set `OPENAI_API_KEY` env var
4. Note the deployed URL

### Frontend
1. Update `EXPO_PUBLIC_API_URL` to deployed URL
2. `eas build --platform android`
3. `eas build --platform ios`
4. `eas submit --platform android`
5. `eas submit --platform ios`

---

## 📱 RESPONSIVE TESTING

```javascript
// Test different screen sizes
// iOS: 390×844 (iPhone)
// Android: 360×800 (standard)
// Tablet: 768×1024 (iPad)
// Web: Full window

// Expo on web simulates all sizes
```

---

## 🎓 KEY CONCEPTS

| Concept | Use | File |
|---------|-----|------|
| Component | UI element | `src/components/*.tsx` |
| Hook | State logic | `src/hooks/*.ts` |
| Service | API call | `src/services/api.ts` |
| Theme | Design tokens | `src/theme/theme.ts` |
| Route | API endpoint | `backend/src/routes/*.ts` |
| Middleware | Request processing | `backend/src/middleware/*.ts` |

---

## 🔑 REMEMBER

✅ No API keys in code  
✅ Use environment variables  
✅ Commit .gitignore  
✅ Never commit .env files  
✅ Keep animations slow (650-1200ms)  
✅ Always use theme colors  
✅ TypeScript everywhere  
✅ Test on real devices  

---

## 🎉 YOU GOT THIS!

```bash
# One-command startup (open 2 terminals):

# Terminal 1:
cd backend && npm install && npm run dev

# Terminal 2:
npm install && npm start
```

Then navigate through the app!

---

**Questions? Check the docs files listed above.**

**Stuck? Check the troubleshooting section.**

**Ready? Let's build! 🚀**
