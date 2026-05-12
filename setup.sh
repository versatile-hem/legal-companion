#!/bin/bash

# Suits In - Project Setup Script
# This script sets up the entire project for development

set -e

echo "🚀 Starting Suits In Project Setup..."
echo "=================================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 21."
    exit 1
fi
echo "✅ Java found: $(java -version 2>&1 | grep -oP '(?<=version ")[^"]*')"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi
echo "✅ Node.js found: $(node -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not found. Make sure PostgreSQL is running."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL found: $(psql --version)"
fi

echo ""
echo "=================================================="
echo "🛠️  Setting up Backend..."
echo "=================================================="

cd backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Install Maven dependencies
echo "📥 Installing Maven dependencies..."
mvn clean install -q

echo "✅ Backend setup complete!"

cd ..

echo ""
echo "=================================================="
echo "🎨 Setting up Frontend..."
echo "=================================================="

cd frontend

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file from template..."
    cp .env.example .env.local
fi

# Install npm dependencies
echo "📥 Installing npm dependencies..."
npm install

echo "✅ Frontend setup complete!"

cd ..

echo ""
echo "=================================================="
echo "🗄️  Setting up Database..."
echo "=================================================="

# Create database
echo "📊 Creating PostgreSQL database..."
psql -U postgres -c "CREATE DATABASE suits_in_dev;" 2>/dev/null || echo "Database might already exist"
psql -U postgres -d suits_in_dev -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" 2>/dev/null || echo "Extension might already exist"

echo "✅ Database setup complete!"

echo ""
echo "=================================================="
echo "✨ Setup Complete!"
echo "=================================================="
echo ""
echo "🚀 To start development, run:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "📖 Then visit:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8080"
echo "   API Docs: http://localhost:8080/swagger-ui.html"
echo ""
echo "🐳 Or use Docker:"
echo "   docker-compose up -d"
echo ""
