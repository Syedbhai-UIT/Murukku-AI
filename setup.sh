#!/bin/bash
# Murukku AI - Automatic Setup Script
# This script sets up the development environment for Murukku AI

set -e  # Exit on error

echo "🍘 Murukku AI - Setup Script"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js $(node --version) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found! Please install Python 3.10+"
    exit 1
fi
echo "✅ Python $(python3 --version) detected"

# Setup frontend
echo ""
echo "📦 Setting up frontend..."
npm install
echo "✅ Frontend dependencies installed"

# Setup backend
echo ""
echo "🐍 Setting up backend..."
cd backend
pip install -r requirements.txt
cd ..
echo "✅ Backend dependencies installed"

# Setup environment files
echo ""
echo "🔐 Configuring environment..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Edit .env and add your OpenRouter API key!"
else
    echo "✅ .env already exists"
fi

if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from backend/.env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Edit backend/.env and add your OpenRouter API key!"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your OpenRouter API key"
echo "2. Edit backend/.env with your OpenRouter API key"
echo "3. Get FREE key from https://openrouter.ai"
echo ""
echo "🚀 To run the app:"
echo "   Terminal 1: cd backend && python -m uvicorn main:app --reload --port 8001"
echo "   Terminal 2: npm run dev"
echo ""
echo "🌐 Open: http://localhost:3000"
echo ""
