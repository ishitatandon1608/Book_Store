#!/bin/bash

echo "🚀 Setting up Bookstore Admin Panel..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env file with your database credentials:"
    echo "   - DB_HOST (default: localhost)"
    echo "   - DB_USER (your MySQL username)"
    echo "   - DB_PASSWORD (your MySQL password)"
    echo "   - DB_NAME (default: bookstore_admin)"
    echo "   - JWT_SECRET (change this to a secure random string)"
    echo ""
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create MySQL database: CREATE DATABASE bookstore_admin;"
echo "2. Edit backend/.env with your database credentials"
echo "3. Run: npm run dev (to start both frontend and backend)"
echo "4. Access the application at: http://localhost:3000"
echo "5. Login with: admin@bookstore.com / admin123"
echo ""
echo "📚 For detailed instructions, see README.md" 