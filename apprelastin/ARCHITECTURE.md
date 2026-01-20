# Relastin - Emotionally Intelligent Communication Platform

A world-class mobile app and backend for calm, supportive conversations with AI.

## 📱 Architecture

```
relastin/
├── backend/              # Node.js + Express + OpenAI
│   ├── src/
│   │   ├── index.ts      # Express server
│   │   ├── services/
│   │   │   └── chat.service.ts    # OpenAI integration
│   │   ├── routes/
│   │   │   └── chat.routes.ts     # API endpoints
│   │   └── middleware/
│   │       └── index.ts           # Rate limiting, errors
│   └── package.json
│
├── src/                  # React Native frontend
│   ├── components/       # UI components
│   │   ├── WelcomeScreen.tsx      # Animated loading
│   │   ├── AuthScreen.tsx         # Login/signup
│   │   ├── ChatScreen.tsx         # Main chat UI
│   │   ├── ReflectionPanel.tsx    # Tone analysis
│   │   └── SettingsScreen.tsx     # Settings
│   ├── services/
│   │   └── api.ts        # Backend communication
│   ├── theme/
│   │   └── theme.ts      # Design system
│   ├── types/
│   │   └── navigation.ts  # Type definitions
│   └── data/
│       └── mockRecipients.ts
│
├── app.json              # Expo config
├── tsconfig.json         # TypeScript
└── package.json
```

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenAI API key to .env
OPENAI_API_KEY=sk-...

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update backend URL (if not localhost)
# EXPO_PUBLIC_API_URL=http://your-backend:3000/api

# Start Expo development
npx expo start

# Run on iOS/Android/Web
# Press 'i' for iOS
# Press 'a' for Android
# Press 'w' for web
```

---

## 🎨 Design System

### Colors

**Warm, Calming Palette:**
- `background: #F8F7F5` - Soft off-white
- `paper: #FFFFFF` - Clean white
- `ink: #2B2621` - Warm charcoal
- `blueDusk: #6B7A9F` - Muted blue (primary accent)
- `lavender: #8B7FA8` - Soft lavender

**No bright reds, greens, or aggressive colors.**

### Typography

- **Headings**: Light weight (300), large sizes (24-48px)
- **Body**: Regular weight (400), readable (14-17px)
- **Spacing**: Generous (16-24px gaps)

### Animations

- **Duration**: Slow (650-1200ms), never rushed
- **Easing**: Smooth ease-in-out, breathing-style
- **Examples**: Fade-ins, gentle slides, opacity pulses

### Theme Usage

```typescript
import { theme } from "./theme/theme";

// Colors
theme.colors.background
theme.colors.blueDusk
theme.colors.ink

// Spacing
theme.spacing.lg
theme.spacing.xl

// Animations
theme.motion.slow    // 1200ms
theme.motion.calm    // 850ms
theme.motion.gentle  // 650ms

// Radii
theme.radii.card     // 16px
theme.radii.pill     // 999px
```

---

## 📡 API Endpoints

### POST /api/chat

Send a message, receive emotionally intelligent response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I'm feeling overwhelmed" }
  ]
}
```

**Response:**
```json
{
  "reply": "It sounds like you're dealing with a lot...",
  "model": "gpt-4-mini"
}
```

### POST /api/reflect

Get gentle tone analysis before sending.

**Request:**
```json
{
  "userMessage": "This is ridiculous!"
}
```

**Response:**
```json
{
  "reflection": "This might come across more urgently than intended."
}
```

### GET /api/health

Check service status.

---

## 🧠 AI System Rules

The backend enforces **strict emotional safety**:

✅ **Do**
- Never judge the user
- Ask permission before suggesting changes
- Reply like a calm, thoughtful human
- Keep responses short to medium
- Use warm, supportive tone

❌ **Don't**
- Force advice or diagnose emotions
- Escalate conflict or manipulate behavior
- Use clinical language
- Make assumptions

---

## 🛡️ Security & Privacy

### Environment Variables

**Backend:**
```env
OPENAI_API_KEY=sk-...         # Never in version control!
OPENAI_MODEL=gpt-4-mini
PORT=3000
NODE_ENV=production
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend:**
```env
EXPO_PUBLIC_API_URL=https://api.relastin.app/api
EXPO_PUBLIC_APP_NAME=Relastin
```

### Frontend Best Practices

- No API keys in frontend code
- No sensitive data in local storage
- All AI calls go through backend only
- Environment variables for configuration

---

## 🎭 Screen Components

### 1. WelcomeScreen
- Animated gradient background
- Breathing text animation
- Calming, meditative pace
- No spinners or progress bars

### 2. AuthScreen
- Minimal email/password fields
- Reassuring copy
- Soft animations
- Error handling

### 3. ChatScreen
- Card-style message display (not bubbles)
- Staggered message animations
- AI responses feel slightly delayed
- Composer always available

### 4. ReflectionPanel
- Bottom-sheet style panel
- Frosted glass overlay
- Tone analysis
- Three action buttons: Continue, Adjust, Send Anyway

### 5. SettingsScreen
- Toggle switches only
- Simple language
- Privacy-first messaging
- Minimal options

---

## 📱 Component Props

### WelcomeScreen
```typescript
interface WelcomeScreenProps {
  onComplete?: () => void;
}
```

### AuthScreen
```typescript
interface AuthScreenProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}
```

### ChatScreen
```typescript
interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onReflect?: (text: string) => void;
  isLoading?: boolean;
}
```

### ReflectionPanel
```typescript
interface ReflectionPanelProps {
  visible: boolean;
  message: string;
  reflection: string;
  onContinue: () => void;
  onAdjust: () => void;
  onSendAnyway: () => void;
  isLoading?: boolean;
}
```

---

## 💡 Usage Example

```typescript
import React, { useState } from "react";
import { ChatScreen, ReflectionPanel } from "@/components";
import { sendChatMessage, getReflection } from "@/services/api";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    
    const newMessage = { role: "user" as const, content: text };
    setMessages([...messages, { id: Date.now().toString(), ...newMessage, timestamp: Date.now() }]);

    try {
      const response = await sendChatMessage([...messages, newMessage]);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: response.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflect = async (text: string) => {
    try {
      const { reflection } = await getReflection(text);
      setReflection(reflection);
      setShowReflection(true);
    } catch (error) {
      console.error("Reflection error:", error);
    }
  };

  return (
    <>
      <ChatScreen
        messages={messages}
        onSendMessage={handleSendMessage}
        onReflect={handleReflect}
        isLoading={isLoading}
      />
      <ReflectionPanel
        visible={showReflection}
        message={messages[messages.length - 1]?.content || ""}
        reflection={reflection}
        onContinue={() => setShowReflection(false)}
        onAdjust={() => setShowReflection(false)}
        onSendAnyway={() => setShowReflection(false)}
      />
    </>
  );
}
```

---

## 🚀 Deployment

### Backend (Node.js)

```bash
# Build
npm run build

# Deploy to:
# - Heroku: heroku create relastin && git push heroku main
# - Railway: railway up
# - Vercel: vercel deploy --prod
# - AWS Lambda: serverless deploy
```

### Frontend (React Native)

```bash
# Build APK (Android)
eas build --platform android

# Build IPA (iOS)
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 📚 Technologies

**Backend:**
- Node.js 18+
- Express.js
- OpenAI API
- TypeScript
- CORS enabled
- Rate limiting

**Frontend:**
- React Native
- Expo
- TypeScript
- Animated API
- AsyncStorage (auth state)

---

## 🤝 Contributing

1. Keep the calm aesthetic
2. Maintain the 650-1200ms animation speeds
3. Never use bright colors or urgent UI patterns
4. Test on both iOS and Android
5. Keep tone supportive, never judgmental

---

## 📄 License

MIT

---

## 💌 Vision

**Relastin makes communication calmer.**

The app should feel more relaxing after opening than before. Users should feel emotionally supported, not rushed or judged. Every interaction reinforces trust and care.

**"Pause. Then speak."**
