# 🔐 Security & Setup Guide - Murukku AI

## API Key Security

### ⚠️ Important: Previous API Key Exposure

The repository previously had exposed API keys in `.env` and `backend/.env` files that were committed before `.gitignore` was properly configured. 

**If you cloned this repo before security hardening:**
1. ✅ The exposed key has been rotated
2. ✅ All hardcoded keys have been removed from source code
3. ✅ New setup uses environment variables only
4. ✅ `.gitignore` now prevents `.env` files from being committed

---

## 🚀 Secure Setup Instructions

### Quick Setup (Recommended)

**Windows:**
```powershell
.\setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

These scripts will:
- ✅ Install all dependencies
- ✅ Create `.env` and `backend/.env` files
- ✅ Show you where to add your API key

---

### Manual Setup

#### Step 1: Clone Repository
```bash
git clone https://github.com/Syedbhai-UIT/Murukku-AI.git
cd Murukku-AI
```

#### Step 2: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### Step 3: Get FREE OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for free account
3. Click "Keys" in the sidebar
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

#### Step 4: Create `.env` Files

**In root directory:**
```bash
cp .env.example .env
```

Edit `.env` and add your key:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
VITE_API_URL=http://localhost:8001
VITE_SITE_URL=http://localhost:3000
VITE_SITE_NAME=Murukku AI
```

**In backend directory:**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
BACKEND_PORT=8001
ENVIRONMENT=development
```

#### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔑 Environment Variables Explained

### Frontend (.env in root)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_OPENROUTER_API_KEY` | **Required** - OpenRouter API key | `sk-or-v1-...` |
| `VITE_API_URL` | Backend server URL | `http://localhost:8001` |
| `VITE_SITE_URL` | Frontend URL | `http://localhost:3000` |
| `VITE_SITE_NAME` | App name for display | `Murukku AI` |

### Backend (.env in backend/)

| Variable | Purpose | Example |
|----------|---------|---------|
| `OPENROUTER_API_KEY` | **Required** - OpenRouter API key | `sk-or-v1-...` |
| `BACKEND_PORT` | Server port | `8001` |
| `ENVIRONMENT` | Deployment environment | `development` |

---

## ✅ Security Best Practices

### For Development

- ✅ Use `.env.example` as a template only
- ✅ Create your own `.env` by copying `.env.example`
- ✅ Add your API key to `.env`
- ✅ **NEVER** commit `.env` files
- ✅ **NEVER** commit API keys to GitHub
- ✅ Each developer gets their own API key

### For Production

- ✅ Use environment variables from your hosting platform
  - Heroku: Use Config Vars
  - Vercel: Use Environment Variables
  - AWS: Use Systems Manager Parameter Store or Secrets Manager
  - Docker: Use Docker secrets or environment variables
- ✅ **NEVER** embed keys in Docker images
- ✅ Rotate keys regularly
- ✅ Use restrictive permissions for API keys
- ✅ Monitor API key usage

### If You Expose a Key

1. **Immediately regenerate on openrouter.ai**
2. **Delete the old key**
3. **Update all `.env` files with new key**
4. **Run the app to verify it works**

---

## 🚨 Troubleshooting

### "OPENROUTER_API_KEY not found!"

**Solution:** 
- Create `backend/.env` file
- Add your API key to `backend/.env`
- Make sure key starts with `sk-or-v1-`

### "Cannot connect to backend"

**Solution:**
- Verify backend is running on port 8001
- Check `.env` has `VITE_API_URL=http://localhost:8001`
- Make sure Python dependencies are installed
- Run: `cd backend && pip install -r requirements.txt`

### "Invalid API key format"

**Solution:**
- OpenRouter keys should start with `sk-or-v1-`
- Make sure you copied the entire key
- Regenerate a new key if unsure

### Setup script errors

**Windows:**
- Run Command Prompt as Administrator
- Make sure Python and Node.js are in PATH
- Try: `python -m pip install --upgrade pip`

**Linux/Mac:**
- Run: `chmod +x setup.sh`
- Make sure you have Python 3.10+ and Node 18+
- Try: `python3 -m pip install --upgrade pip`

---

## 📚 Additional Resources

- **OpenRouter Docs:** https://openrouter.ai/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Vite Guide:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/

---

## 🤝 Contributing

If you find a security issue:
1. **DO NOT** create a public GitHub issue
2. Email: syed@example.com with details
3. Include: Issue description, steps to reproduce, impact

We take security seriously! 🔐

---

**Last Updated:** 2024
