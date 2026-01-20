# Getting Started with Relastin

A step-by-step guide to set up and run the Relastin platform locally.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- OpenAI API key (get at https://platform.openai.com)
- Git

---

## 🔧 Backend Setup

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

### 4. Add your OpenAI API key

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-mini
PORT=3000
NODE_ENV=development
```

Get your key from: https://platform.openai.com/account/api-keys

### 5. Start development server

```bash
npm run dev
```

You should see:
```
🌙 Relastin Backend running on http://localhost:3000
📝 Chat endpoint: POST /api/chat
🔍 Reflect endpoint: POST /api/reflect
❤️  Health check: GET /api/health
```

### 6. Test the backend

```bash
# In another terminal, test the chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Hello, how are you?"}'
```

You should get back a thoughtful response.

---

## 📱 Frontend Setup

### 1. Navigate to root directory

```bash
cd ..
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env.local
```

### 4. Update backend URL (if needed)

Edit `.env.local`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**For iOS/Android devices on same network:**
```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000/api
```

Find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)

### 5. Start Expo

```bash
npm start
```

### 6. Choose platform

- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator
- Press **`w`** for Web Browser
- Scan QR code with Expo Go app on physical device

---

## ✅ Testing the Integration

### 1. Open the app (browser or device)

You should see the welcome screen with "Pause. Then speak."

### 2. Sign up / Login

Use any email and password (6+ characters). Authentication is mocked locally.

### 3. Send a message

Type something like:
- "I'm feeling overwhelmed about my project"
- "How do I handle criticism?"
- "I'm not sure what to say to them"

### 4. See AI response

The backend will send your message to OpenAI and respond with an emotionally intelligent reply.

### 5. Test tone reflection

- Tap "How does this sound?" on your message
- The AI will analyze the tone
- Choose to continue, adjust, or send anyway

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "OPENAI_API_KEY is not defined"**
- Check `.env` file exists and has your API key
- Restart: `npm run dev`

**Error: "Port 3000 already in use"**
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend won't connect to backend

**Error: "Failed to fetch"**
- Check backend is running: `http://localhost:3000`
- Check `EXPO_PUBLIC_API_URL` in `.env.local`
- Try from physical device: Use your computer's IP instead of localhost
- Check CORS: Backend has CORS enabled for localhost

**On Android device:**
- Use `http://10.0.2.2:3000/api` instead of localhost
- Or your computer's actual IP address

### Slow responses

- This is intentional! AI responses include gentle delays
- Cold OpenAI API calls may take 2-3 seconds
- Subsequent calls are faster

---

## 📁 Project Structure

```
relastin/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Main server
│   │   ├── services/
│   │   │   └── chat.service.ts    # OpenAI integration
│   │   ├── routes/
│   │   │   └── chat.routes.ts     # API endpoints
│   │   └── middleware/
│   │       └── index.ts           # Rate limiting, errors
│   ├── package.json
│   └── .env                    # Your keys (gitignored)
│
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ReflectionPanel.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   │   └── api.ts              # Backend API client
│   ├── theme/
│   │   └── theme.ts            # Design system
│   └── types/
│       └── navigation.ts
│
├── app.json                    # Expo config
├── tsconfig.json               # TypeScript
├── package.json                # Frontend dependencies
├── .env.local                  # Your config (gitignored)
└── ARCHITECTURE.md             # Full documentation
```

---

## 🚀 Next Steps

### Development

1. Explore `src/components/` to see the UI components
2. Check `theme/theme.ts` for colors and animations
3. Read `backend/src/services/chat.service.ts` for AI configuration
4. Customize the system prompt for different use cases

### Customization

**Change colors:**
Edit `src/theme/theme.ts`:
```typescript
colors: {
  background: "#F8F7F5",
  blueDusk: "#6B7A9F",
  // ... more colors
}
```

**Change AI behavior:**
Edit `backend/src/services/chat.service.ts` - update `SYSTEM_PROMPT`

**Add new screens:**
Create in `src/screens/` and add to navigation

### Deployment

**Backend:**
- Deploy to Heroku, Railway, or AWS
- Set environment variables on your hosting platform
- Update `EXPO_PUBLIC_API_URL` in frontend

**Frontend:**
- Build APK: `eas build --platform android`
- Build IPA: `eas build --platform ios`
- Submit to stores: `eas submit`

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [OpenAI API](https://platform.openai.com/docs)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Animated API](https://reactnative.dev/docs/animated)

---

## 💬 Support

- Backend README: `backend/README.md`
- Full Architecture: `ARCHITECTURE.md`
- Issues? Check environment variables first!

---

## 🎯 Key Features to Try

1. **Welcome Screen** - Smooth fade-in animations
2. **Chat** - Send messages and get AI responses
3. **Reflection Panel** - Tone analysis before sending
4. **Settings** - Privacy toggles and customization
5. **Dark/Light Mode** - Theme system (ready to extend)

---

Enjoy building Relastin! 🌙
