# Quick Start Guide - PowerShell

## For Windows PowerShell (5.1+)

Use **semicolons (;)** to separate commands instead of `&&`:

```powershell
# BACKEND SETUP
cd backend; npm install; npm run dev

# In a new terminal, FRONTEND SETUP
npm install; npm start
```

## Using && in PowerShell

If you prefer using `&&`, you need to use the following syntax:

```powershell
# Backend
cd backend | Out-Null; npm install -eq $? -and npm run dev

# Or use the following in PowerShell 7.0+
cd backend && npm install && npm run dev
```

**Note**: The `&&` operator only works in **PowerShell 7.0+** (PowerShell Core). For Windows PowerShell 5.1, use semicolons (`;`).

## Quick Start Steps

### 1. Backend Setup
```powershell
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3000`

### 2. Frontend Setup (in a new PowerShell window)
```powershell
npm install
npm start
```

The frontend will start on `http://localhost:8081` (Expo)

## API Configuration

Your backend is configured with:
- **AI Provider**: OpenAI
- **Model**: gpt-4-mini
- **API Key**: Already set in `.env` file

### To Switch to Your Own Custom API:

Edit `backend/.env` and set:
```
AI_PROVIDER=custom
CUSTOM_API_BASE_URL=https://your-api-endpoint.com
CUSTOM_API_KEY=your_api_key_here
CUSTOM_MODEL=your-model-name
```

Then restart the backend.

## Environment Variables Loaded

The `.env` file in `backend/` contains:
- `OPENAI_API_KEY` - Your API key (keep this safe!)
- `OPENAI_MODEL` - Model to use (gpt-4-mini, gpt-4, etc.)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

## Troubleshooting

**"npm: The term 'npm' is not recognized"**
- Install Node.js from https://nodejs.org/

**"Cannot find module"**
- Delete `node_modules` and run `npm install` again

**Port 3000 already in use**
- Change PORT in `backend/.env` to a different number, e.g., `PORT=3001`

## Next Steps

1. Backend API is ready at: `http://localhost:3000/api/health`
2. Frontend is ready at: `http://localhost:8081`
3. Start sending messages through the app!
