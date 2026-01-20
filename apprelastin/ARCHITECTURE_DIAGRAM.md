# 🏗️ RELASTIN ARCHITECTURE DIAGRAM

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER'S MOBILE DEVICE                          │
│                         (React Native + Expo)                          │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND APPLICATION                         │  │
│  │                                                                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │  │
│  │  │   Welcome   │  │     Auth    │  │    Chat     │             │  │
│  │  │   Screen    │  │   Screen    │  │   Screen    │             │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘             │  │
│  │         ↓               ↓                  ↓                    │  │
│  │  ┌────────────────────────────────────────────────────┐        │  │
│  │  │              THEME SYSTEM                          │        │  │
│  │  │  Colors | Typography | Spacing | Animations       │        │  │
│  │  └────────────────────────────────────────────────────┘        │  │
│  │         ↑                                                      │  │
│  │  ┌────────────────────────────────────────────────────┐        │  │
│  │  │              STATE MANAGEMENT                      │        │  │
│  │  │  useChat() | useAuth() | Hooks                     │        │  │
│  │  └────────────────────────────────────────────────────┘        │  │
│  │                      ↓                                         │  │
│  │  ┌────────────────────────────────────────────────────┐        │  │
│  │  │           API CLIENT (api.ts)                      │        │  │
│  │  │  No API keys! Environment variables only           │        │  │
│  │  └────────────────────────────────────────────────────┘        │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                             │                                        │
└─────────────────────────────┼────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              │
                    ┌─────────▼─────────┐
                    │                   │
    ┌───────────────┼─────────────────┬─┴──────────────┐
    │               │                 │                │
    │               │                 │                │
┌───▼──────┐    ┌──▼───────┐    ┌─────▼────┐   ┌─────▼──────┐
│  POST    │    │  POST    │    │   GET    │   │   CORS     │
│  /chat   │    │ /reflect │    │ /health  │   │ Enabled    │
└─────────────┘    └──────────┘    └──────────┘   └────────────┘
     ▲                  ▲                ▲
     │                  │                │
     └──────────────────┼────────────────┘
                        │
    ┌───────────────────▼─────────────────┐
    │       EXPRESS API SERVER            │
    │     (backend/src/index.ts)          │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │  ROUTES (chat.routes.ts)     │   │
    │  │  - Message handling          │   │
    │  │  - Input validation          │   │
    │  │  - Error responses           │   │
    │  └──────────────────────────────┘   │
    │                │                    │
    │                ▼                    │
    │  ┌──────────────────────────────┐   │
    │  │ CHAT SERVICE (chat.service) │   │
    │  │  - OpenAI client setup       │   │
    │  │  - System prompt            │   │
    │  │  - Message processing       │   │
    │  │  - Tone analysis            │   │
    │  └──────────────────────────────┘   │
    │                │                    │
    │                ▼                    │
    │  ┌──────────────────────────────┐   │
    │  │  MIDDLEWARE                  │   │
    │  │  - Rate limiting             │   │
    │  │  - Error handling            │   │
    │  │  - CORS                      │   │
    │  └──────────────────────────────┘   │
    └────────────────┬──────────────────────┘
                     │
                     │ Environment Variables
                     │ OPENAI_API_KEY
                     │
            ┌────────▼────────┐
            │  OPENAI API     │
            │  (gpt-4-mini)   │
            │                 │
            │ - Chat responses│
            │ - Tone analysis │
            │ - Safety rules  │
            └─────────────────┘
```

---

## Data Flow - Chat Message

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER TYPES MESSAGE IN CHATSCREEN                             │
│    ↓                                                             │
│ 2. CLICK "SEND" → useChat().sendMessage("Hello")               │
│    ↓                                                             │
│ 3. API CLIENT → api.ts → fetch(POST /api/chat)                │
│    ↓                                                             │
│ 4. NETWORK → HTTP Request to backend                           │
│    ↓                                                             │
│ 5. BACKEND RECEIVES → chat.routes.ts validates input           │
│    ↓                                                             │
│ 6. CHAT SERVICE → chat.service.ts calls OpenAI API             │
│    ↓                                                             │
│ 7. OPENAI PROCESSES → gpt-4-mini with system prompt            │
│    ↓                                                             │
│ 8. BACKEND RESPONDS → Returns { reply, model }                │
│    ↓                                                             │
│ 9. FRONTEND RECEIVES → api.ts returns data                     │
│    ↓                                                             │
│ 10. HOOK UPDATES → useChat() adds to messages array            │
│    ↓                                                             │
│ 11. RE-RENDER → ChatScreen displays new message                │
│    ↓                                                             │
│ 12. ANIMATION → Message card fades in with slide               │
│    ↓                                                             │
│ USER SEES RESPONSE ✓                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Tone Reflection

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER TAPS "How does this sound?"                             │
│    ↓                                                             │
│ 2. ReflectionPanel opens (bottom-sheet animation)              │
│    ↓                                                             │
│ 3. useChat().getReflectionForMessage(userMessage)              │
│    ↓                                                             │
│ 4. API CLIENT → api.ts → fetch(POST /api/reflect)             │
│    ↓                                                             │
│ 5. BACKEND → chat.routes.ts → chat.service.ts                 │
│    ↓                                                             │
│ 6. OPENAI ANALYZES TONE (specialized prompt)                   │
│    ↓                                                             │
│ 7. RESPONSE → Gentle reflection on message tone                │
│    ↓                                                             │
│ 8. FRONTEND RECEIVES → Updates ReflectionPanel                 │
│    ↓                                                             │
│ USER SEES OPTIONS:                                              │
│ - Continue as is                                                │
│ - Adjust tone                                                   │
│ - Send anyway                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── WelcomeScreen
│   ├── Animated.View (fade-in)
│   ├── Animated.Text (breathing animation)
│   └── BreathingDot × 3
│
├── AuthScreen
│   ├── TextInput (email)
│   ├── TextInput (password)
│   ├── TouchableOpacity (button)
│   └── Animated.View (slide-up)
│
├── ChatScreen
│   ├── ScrollView
│   │   └── MessageCard × N
│   │       ├── Animated.View
│   │       ├── Text (message)
│   │       └── TouchableOpacity (reflect)
│   │
│   ├── TypingIndicator
│   │   └── Animated.View × 3 (bouncing dots)
│   │
│   └── ComposerFooter
│       ├── TextInput
│       ├── TouchableOpacity (send)
│       └── Text (char counter)
│
├── ReflectionPanel (Modal)
│   ├── Animated.View (slide-up)
│   ├── Text (reflection)
│   ├── TouchableOpacity (continue)
│   ├── TouchableOpacity (adjust)
│   └── TouchableOpacity (send anyway)
│
└── SettingsScreen
    ├── ScrollView
    ├── SettingRow × N
    │   ├── Text (label)
    │   └── Switch
    ├── SettingLink × N
    │   └── TouchableOpacity
    └── TouchableOpacity (logout)
```

---

## File Dependencies

```
Frontend:
api.ts → (sends requests) → Backend
  ↓
useChat.ts → (manages state) → api.ts
useAuth.ts → (manages state) → AsyncStorage
  ↓
ChatScreen.tsx → (uses) → useChat + api
AuthScreen.tsx → (uses) → useAuth
ReflectionPanel.tsx → (displays) → reflection
SettingsScreen.tsx → (uses) → useAuth
  ↓
theme.ts → (styles) → All components

Backend:
index.ts (server entry)
  ↓
chat.routes.ts (API endpoints)
  ↓
chat.service.ts (OpenAI integration)
  ↓
middleware/index.ts (rate limiting)
```

---

## State Management Flow

```
User Interaction
     ↓
Component (ChatScreen, AuthScreen, etc.)
     ↓
Hook (useChat, useAuth)
     ↓
API Call (api.ts)
     ↓
Backend (Express)
     ↓
External Service (OpenAI or Database)
     ↓
Response
     ↓
Hook Updates State
     ↓
Component Re-renders
     ↓
UI Updates
     ↓
User Sees Result
```

---

## Theme System Architecture

```
theme.ts
├── colors
│   ├── background: #F8F7F5
│   ├── paper: #FFFFFF
│   ├── ink: #2B2621
│   ├── blueDusk: #6B7A9F (primary)
│   └── lavender: #8B7FA8 (secondary)
│
├── spacing
│   ├── xs: 4
│   ├── sm: 8
│   ├── md: 12
│   ├── lg: 16
│   ├── xl: 24
│   └── xxl: 32
│
├── type (typography)
│   ├── display: 48px
│   ├── title: 28px
│   ├── body: 17px
│   └── small: 13px
│
├── motion (animations)
│   ├── slow: 1200ms
│   ├── calm: 850ms
│   ├── gentle: 650ms
│   └── micro: 320ms
│
├── radii (border radius)
│   ├── sm: 8
│   ├── card: 16
│   └── pill: 999
│
└── shadows
    ├── xs, sm, md, lg, xl
    └── All soft (low opacity)

Used by:
All components import { theme } and use:
- theme.colors.primary
- theme.spacing.lg
- theme.motion.gentle
- theme.typography.body
- etc.
```

---

## Security Model

```
Frontend (User Device)
├── No API keys ✓
├── No passwords stored ✓
├── Environment variables only ✓
├── All API calls via backend ✓
└── HTTPS/TLS encryption ✓

Backend (Server)
├── OPENAI_API_KEY stored safely ✓
├── Rate limiting enabled ✓
├── Input validation ✓
├── Error handling ✓
├── CORS configured ✓
└── Rate limited requests ✓

OpenAI
└── API key protected ✓
```

---

## Deployment Architecture

```
Development
├── Backend: http://localhost:3000
├── Frontend: Expo dev server
└── Database: None (mock)

Staging
├── Backend: https://api-staging.relastin.app
├── Frontend: Staging build
└── Database: Cloud (optional)

Production
├── Backend: https://api.relastin.app (Heroku/Railway/AWS)
├── Frontend: App Store + Google Play
└── Database: Production DB (if needed)
```

---

## Environment Variable Scope

```
Frontend (.env.local)
├── EXPO_PUBLIC_API_URL          ← Backend URL
├── EXPO_PUBLIC_APP_NAME         ← Display name
└── [All visible in app bundle]  ⚠️ Not for secrets!

Backend (.env) ← NEVER committed
├── OPENAI_API_KEY               ← Secret! 🔐
├── OPENAI_MODEL                 ← Model selection
├── PORT                         ← Server port
└── NODE_ENV                     ← Environment
```

---

## Performance Optimization

```
Frontend Optimization
├── Component memoization
├── Lazy loading screens
├── Efficient animations (native driver)
├── Message virtualization (ScrollView)
└── Cached API responses (optional)

Backend Optimization
├── Rate limiting (prevent abuse)
├── Connection pooling
├── Error caching
├── Request validation (early fail)
└── Logging for monitoring
```

---

This architecture is:
✅ Modular (easy to extend)
✅ Secure (no hardcoded secrets)
✅ Scalable (rate limiting, efficient)
✅ Type-safe (TypeScript everywhere)
✅ Well-documented (comments throughout)

---

**Ready to implement? Start with GETTING_STARTED.md**
