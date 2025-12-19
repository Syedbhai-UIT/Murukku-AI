<div align="center">

# 🍘 Murukku AI - Anna University AI Assistant

### உங்கள் AI நண்பன்! (Your AI Friend!)

<img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br/>
<br/>

**Your Tamil-English bilingual AI study companion for Anna University students** 🎓

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [🔧 Configuration](#-configuration) • [🎨 AI Models](#-ai-models) • [📸 Screenshots](#-screenshots)

</div>

---

## 🌟 What is Murukku AI?

Murukku AI (முருக்கு AI) is an intelligent AI assistant specifically designed for **Anna University students**. It speaks both **Tamil (தமிழ்)** and **Tanglish** naturally, combining multiple AI models to provide comprehensive academic support including syllabus guidance, notes generation, coding help, image generation, and mental wellness support.

<details>
<summary><b>🎯 Click to see what makes Murukku AI special</b></summary>

- 🗣️ **Tamil & Tanglish Support** - Natural bilingual conversation with தமிழ் script
- 🧠 **Multi-Model AI** - Uses the best AI model for each task automatically
- 📏 **Adaptive Responses** - Short answers for simple questions, detailed for complex ones
- 📚 **AU Curriculum Expert** - R2021 & R2017 syllabus for all departments
- 🎨 **Image Generation** - Create diagrams, circuits, and visual aids
- 💻 **Code Helper** - DSA, Python, Java, C++ assistance
- 🗣️ **Voice Support** - Speech-to-text and text-to-speech
- 😊 **Mental Wellness** - Stress relief and motivational support
- 🎮 **Relaxation Games** - Snake, Tetris, 2048, and more!

</details>

---

## ✨ Features

| Feature | Description | AI Model Used |
|---------|-------------|---------------|
| 📖 **AU Expert** | Syllabus, exam patterns, CGPA calculator | LLaMA 3.3 70B |
| 📝 **Notes Generator** | Instant detailed study notes | Qwen 3 235B |
| 🖼️ **Image Engine** | Generate diagrams & visual aids | FLUX / SDXL / Realistic Vision |
| 💻 **Coding Help** | DSA, programming guidance | DeepSeek R1 / Qwen Coder |
| 🧮 **Math Solver** | Step-by-step solutions | Phi-4 / DeepSeek R1 |
| 📅 **Study Planner** | Custom schedules | LLaMA 3.3 |
| 🎌 **Anime Buddy** | Recommendations & discussions | LLaMA 3.3 |
| 💼 **Placement Prep** | Interview tips, aptitude | LLaMA 3.3 |
| 💚 **Mental Support** | Motivation & relaxation | LLaMA 3.3 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.10+
- **OpenRouter API Key** (FREE - takes 5 minutes)

### ⚡ Automatic Setup (Easiest!)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This will automatically:
- ✅ Install all dependencies
- ✅ Create `.env` and `backend/.env`
- ✅ Guide you through API key setup

---

### 📋 Manual Setup (5 Steps)

#### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/Syedbhai-UIT/Murukku-AI.git
cd Murukku-AI

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

#### 2️⃣ Get FREE API Key (5 minutes)

1. Go to **[openrouter.ai](https://openrouter.ai)**
2. Sign up for free
3. Go to **Keys** section
4. Create new API key
5. Copy key starting with `sk-or-v1-`

### 3️⃣ Configure Environment

**Create `.env` file in root folder:**

```bash
cp .env.example .env
```

**Edit `.env` and paste your API key:**

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
VITE_API_URL=http://localhost:8001
VITE_SITE_URL=http://localhost:3000
VITE_SITE_NAME=Murukku AI
```

> ⚠️ **Important:** `.env` is gitignored - never commit it!

### 4️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5️⃣ Open in Browser

```
🌐 Frontend: http://localhost:3000
🔌 Backend API: http://localhost:8001
📚 API Docs: http://localhost:8001/docs
```

---

## 🔐 Security & API Keys

### ✅ Safety Features:
- ✅ `.env` is in `.gitignore` (never pushed to GitHub)
- ✅ API keys loaded from environment variables only
- ✅ No hardcoded secrets in source code
- ✅ `.env.example` + `backend/.env.example` show structure without secrets
- ✅ Backend validates API key exists before running

### 📂 Environment Files:

**Root directory `.env.example`:**
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
VITE_API_URL=http://localhost:8001
VITE_SITE_URL=http://localhost:3000
VITE_SITE_NAME=Murukku AI
```

**Backend directory `backend/.env.example`:**
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
BACKEND_PORT=8001
ENVIRONMENT=development
```

### ⚠️ Critical Remember:
- **NEVER** commit `.env` file (it's in `.gitignore`)
- **NEVER** share your API key in code or GitHub
- Each developer needs their own `.env` file
- Always use `.env.example` as a template
- If you accidentally exposed a key, regenerate it immediately on openrouter.ai

### 🔄 Setup for Team Members:

Each person cloning the repo should:
1. Copy `.env.example` to `.env` in root folder
2. Copy `backend/.env.example` to `backend/.env`
3. Get their own FREE OpenRouter API key
4. Paste key into `.env` files
5. Run the app

**No key sharing needed!** Each person has their own quota.

---

## 🔧 Configuration

<details>
<summary><b>📁 Project Structure</b></summary>

```
Bot/
├── 📂 components/          # React components
│   ├── ChatInterface.tsx   # Main chat UI
│   ├── Features.tsx        # Feature cards
│   ├── Hero.tsx            # Landing hero
│   ├── Navbar.tsx          # Navigation
│   └── ...
├── 📂 services/            # API & services
│   ├── chatService.ts      # Chat logic
│   ├── apiClient.ts        # FastAPI client
│   ├── modelConfig.ts      # AI model configs
│   ├── speechService.ts    # Voice features
│   └── openRouterClient.ts # OpenRouter API
├── 📂 backend/             # Python backend
│   ├── main.py             # FastAPI server
│   ├── requirements.txt    # Python deps
│   └── .env                # API keys
├── App.tsx                 # Main React app
├── index.tsx               # Entry point
├── package.json            # Node deps
└── vite.config.ts          # Vite config
```

</details>

<details>
<summary><b>⚙️ Environment Variables</b></summary>

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini key (optional) | ❌ No |

</details>

---

## 🎨 AI Models

### 🗣️ Language Models (via OpenRouter)

| Model | Best For | Free? |
|-------|----------|-------|
| **LLaMA 3.3 70B** | General chat, AU queries | ✅ |
| **Qwen 3 235B** | Long-form notes, essays | ✅ |
| **DeepSeek R1** | Math, reasoning | ✅ |
| **Qwen Coder 32B** | Programming help | ✅ |
| **Phi-4** | Math, science | ❌ |

### 🖼️ Image Models (via Pollinations.ai - FREE)

| Model | Best For | Trigger Keywords |
|-------|----------|------------------|
| **FLUX** | General, anime | `anime`, `manga` |
| **SDXL** | Classic SD quality | `sdxl`, `stable diffusion` |
| **Realistic Vision** | Photorealistic | `realistic`, `photo`, `portrait` |
| **DreamShaper** | Artistic, fantasy | `dream`, `fantasy`, `surreal` |
| **Juggernaut XL** | Hyper-detailed | `juggernaut`, `detailed` |

<details>
<summary><b>🎯 Auto-Detection Examples</b></summary>

```
"Write Python code for binary search" → DeepSeek/Qwen Coder
"Solve this integral: ∫x²dx" → Phi-4/DeepSeek R1
"Generate a realistic portrait" → Realistic Vision
"Create anime girl with blue hair" → FLUX
"Explain R2021 CSE syllabus" → LLaMA 3.3
```

</details>

---

## 🎤 Voice Features

| Feature | How to Use |
|---------|------------|
| **🎙️ Speech-to-Text** | Click mic button → Speak → Auto-transcribe |
| **🔊 Text-to-Speech** | Click speaker icon on any bot message |

> Uses browser's native Web Speech API - no external services needed!

---

## 📸 Screenshots

<details>
<summary><b>🖼️ View Screenshots</b></summary>

### Landing Page
![Landing](https://via.placeholder.com/800x400?text=Landing+Page)

### Chat Interface
![Chat](https://via.placeholder.com/800x400?text=Chat+Interface)

### Image Generation
![Images](https://via.placeholder.com/800x400?text=Image+Generation)

</details>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=python" width="48" height="48" alt="Python" />
<br>Python
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=fastapi" width="48" height="48" alt="FastAPI" />
<br>FastAPI
</td>
</tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for Anna University Students**

⭐ Star this repo if you find it helpful!

</div>
