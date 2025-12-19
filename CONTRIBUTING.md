# Contributing to Murukku AI

Thank you for your interest in contributing to Murukku AI! 🙏

## Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/Murukku-AI.git
cd Murukku-AI
```

### 2. Run Setup
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

### 3. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Frontend Development
```bash
npm run dev
```
- Main files: `src/components/` and `src/services/`
- Styling: TailwindCSS with Orange/Gold theme
- State: React Context API with localStorage

### Backend Development
```bash
cd backend
python -m uvicorn main:app --reload --port 8001
```
- Framework: FastAPI on Python 3.10+
- API Docs: http://localhost:8001/docs

## Code Style

### TypeScript/React
- Use functional components with hooks
- Add TypeScript types for all props
- Follow existing color scheme (#f97316, #fbbf24)
- Example: Check `ChatInterface.tsx`

### Python
- Follow PEP 8 style guide
- Use type hints for functions
- Keep FastAPI endpoints simple
- Example: Check `backend/main.py`

## Adding Features

### Adding a Game
1. Create component in `components/RelaxationGames.tsx`
2. Add game object to `games` array with:
   - `id`: unique identifier
   - `name`: display name
   - `icon`: emoji
   - `description`: brief description
   - `component`: JSX component
   - `stress`: 'stress' | 'boredom' | 'both'
3. Test on http://localhost:3000

### Adding AI Model Support
1. Update `backend/modelConfig.ts` with model details
2. Add route in `backend/main.py`
3. Test via API docs: http://localhost:8001/docs

### Adding Tamil Support
1. Add phrases to `TAMIL_PHRASES` in `services/chatService.ts`
2. Use in responses naturally
3. Example: "வணக்கம்!" (Vanakkam! - Hello)

## Before Submitting PR

- ✅ Code follows project style
- ✅ No hardcoded API keys
- ✅ All console errors fixed
- ✅ `.env` files not committed
- ✅ Dependencies updated properly
- ✅ Tested locally (frontend + backend)

## Commit Messages

Format: `type: description`

Examples:
- `feat: Add Sudoku game to relaxation section`
- `fix: Correct Tamil character encoding in chat`
- `docs: Update README with new features`
- `refactor: Simplify API client architecture`
- `perf: Optimize image generation caching`

## PR Guidelines

1. **Title:** Brief, descriptive
   - ✅ "Add voice input for chat"
   - ❌ "Update"

2. **Description:** Include:
   - What changed and why
   - How to test
   - Any breaking changes

3. **Labels:** Add appropriate:
   - `feature` - New functionality
   - `bug` - Bug fix
   - `documentation` - Docs update
   - `security` - Security improvements

## Project Structure

```
Bot/
├── components/         # React UI components
├── services/          # API clients, utilities
├── backend/           # FastAPI server
├── App.tsx            # Main app component
├── index.tsx          # Entry point
├── package.json       # Frontend dependencies
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite configuration
```

## Technologies

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Backend:** FastAPI, Python 3.10+, uvicorn
- **APIs:** OpenRouter (AI models), Pollinations.ai (Images)
- **Language Support:** English, Tamil (தமிழ்), Tanglish

## Reporting Issues

Found a bug? Please create an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant
- Environment (OS, Browser, Node version)

## Security

- **Never** commit `.env` files
- **Never** hardcode API keys
- **Never** share credentials in issues
- Report security issues privately

## Questions?

- Check existing issues/discussions
- Review documentation in README.md
- Look at SECURITY.md for setup help

---

**Happy coding! 🚀**

இவை முருக்கு AI-ன் பங்களிப்பாளர்களுக்கான வழிகள்! 🙏
