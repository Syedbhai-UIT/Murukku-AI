@echo off
REM Murukku AI - Windows Setup Script
REM This script sets up the development environment for Murukku AI

echo.
echo 🍘 Murukku AI - Setup Script (Windows)
echo ======================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js 18+
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found! Please install Python 3.10+
    echo Visit: https://www.python.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ %PYTHON_VERSION% detected

REM Setup frontend
echo.
echo 📦 Setting up frontend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Setup backend
echo.
echo 🐍 Setting up backend...
cd backend
call pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

REM Setup environment files
echo.
echo 🔐 Configuring environment...

if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo ⚠️  Edit .env and add your OpenRouter API key!
) else (
    echo ✅ .env already exists
)

if not exist "backend\.env" (
    echo Creating backend\.env from backend\.env.example...
    copy backend\.env.example backend\.env >nul
    echo ⚠️  Edit backend\.env and add your OpenRouter API key!
) else (
    echo ✅ backend\.env already exists
)

echo.
echo ======================================
echo ✅ Setup Complete!
echo.
echo 📝 Next steps:
echo 1. Edit .env with your OpenRouter API key
echo 2. Edit backend\.env with your OpenRouter API key
echo 3. Get FREE key from https://openrouter.ai
echo.
echo 🚀 To run the app:
echo    Command 1: cd backend ^&^& python -m uvicorn main:app --reload --port 8001
echo    Command 2: npm run dev
echo.
echo 🌐 Open: http://localhost:3000
echo.
pause
