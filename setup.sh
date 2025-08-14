#!/bin/bash

echo "🚀 Setting up Bookstore Admin Panel..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v16 or higher."
    print_info "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "Node.js and npm are installed"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_warning "Node.js version $(node -v) detected. Version 16 or higher is recommended."
fi

# Install root dependencies
print_info "Installing root dependencies..."
npm install

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    print_info "Creating .env file from template..."
    cp .env.example .env
    print_status ".env file created"
    echo ""
    print_warning "IMPORTANT: Please edit backend/.env file with your database credentials:"
    echo "   - DB_HOST (default: localhost)"
    echo "   - DB_USER (your MySQL username, default: root)"
    echo "   - DB_PASSWORD (your MySQL password)"
    echo "   - DB_NAME (default: bookstore_admin)"
    echo "   - JWT_SECRET (change this to a secure random string)"
    echo ""
else
    print_status ".env file already exists"
fi

cd ..

# Check if MySQL is running
print_info "Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    # Try to connect to MySQL
    if mysql -u root -e "SELECT 1;" &> /dev/null; then
        print_status "MySQL is running and accessible"
        
        # Try to create database
        if mysql -u root -e "CREATE DATABASE IF NOT EXISTS bookstore_admin;" &> /dev/null; then
            print_status "Database 'bookstore_admin' created/verified"
        else
            print_warning "Could not create database. You may need to create it manually:"
            echo "   mysql -u root -p"
            echo "   CREATE DATABASE bookstore_admin;"
        fi
    else
        print_warning "MySQL is installed but not accessible with default credentials"
        print_info "You may need to:"
        echo "   1. Start MySQL service"
        echo "   2. Set up MySQL root password"
        echo "   3. Update .env file with correct credentials"
    fi
else
    print_warning "MySQL is not installed or not in PATH"
    print_info "Please install MySQL:"
    echo "   - macOS: brew install mysql"
    echo "   - Ubuntu: sudo apt-get install mysql-server"
    echo "   - Windows: Download from https://dev.mysql.com/downloads/mysql/"
fi

echo ""
print_status "Setup completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Start MySQL service if not running"
echo "3. Run: npm run dev (to start both frontend and backend)"
echo "4. Access the application at: http://localhost:3000"
echo "5. Login with: admin@bookstore.com / admin123"
echo ""
print_info "For detailed instructions, see README.md"

# Make setup script executable
chmod +x setup.sh 