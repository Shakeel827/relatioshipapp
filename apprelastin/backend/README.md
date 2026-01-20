# Relastin Backend

Emotionally intelligent communication backend powered by OpenAI.

## Quick Start

### Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-...
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### `POST /api/chat`

Send a message and receive an emotionally intelligent response.

**Request:**
```json
{
  "userMessage": "I'm feeling overwhelmed about the project deadline"
}
```

Or with conversation history:
```json
{
  "messages": [
    { "role": "user", "content": "How do I handle stress?" },
    { "role": "assistant", "content": "Take a breath..." },
    { "role": "user", "content": "What else can I do?" }
  ]
}
```

**Response:**
```json
{
  "reply": "It sounds like you're dealing with a lot of pressure. Sometimes breaking it into smaller steps helps. What's the most urgent part?",
  "model": "gpt-4-mini"
}
```

### `POST /api/reflect`

Get a gentle tone analysis of a message before sending.

**Request:**
```json
{
  "userMessage": "This project is a disaster!"
}
```

**Response:**
```json
{
  "reflection": "This message might come across as more urgent than intended. Would you like to adjust the tone?"
}
```

### `GET /api/health`

Check service status.

**Response:**
```json
{
  "status": "ok",
  "model": "gpt-4-mini",
  "timestamp": "2024-01-19T12:00:00.000Z"
}
```

## Environment Variables

```env
# Required
OPENAI_API_KEY=your_key_here

# Optional
OPENAI_MODEL=gpt-4-mini          # Default model
PORT=3000                         # Server port
NODE_ENV=development             # development or production
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # Per window
```

## Features

✅ **Emotionally Intelligent**: System prompt follows strict AI safety rules  
✅ **No Judgment**: Never diagnoses or judges users  
✅ **Safe**: No manipulation, escalation, or forced advice  
✅ **Conversational**: Warm, supportive, human tone  
✅ **Rate Limited**: Protects against abuse  
✅ **CORS Enabled**: Works with frontend apps  
✅ **Error Handling**: Graceful failures with helpful messages

## AI System Rules

The backend enforces these rules:

- ❌ Never judge the user
- ❌ Never force advice
- ❌ Never diagnose emotions
- ❌ Never escalate conflict
- ❌ Never manipulate behavior
- ✅ Ask permission before suggesting changes
- ✅ Reply like a calm, thoughtful human
- ✅ Keep replies short to medium
- ✅ Use warm, supportive tone

## Architecture

```
src/
  index.ts                 # Express app entry
  services/
    chat.service.ts       # OpenAI integration
  routes/
    chat.routes.ts        # API endpoints
  middleware/
    index.ts              # Rate limiting, error handling
```

## Technologies

- **Express.js**: Lightweight web framework
- **OpenAI API**: AI language model
- **TypeScript**: Type safety
- **CORS**: Cross-origin requests
- **dotenv**: Environment management
