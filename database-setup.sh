#!/bin/bash

echo "🗄️  Database Setup for Bookstore Admin Panel"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)

# Check if MySQL is installed
check_mysql_installation() {
    if command -v mysql &> /dev/null; then
        print_status "MySQL is installed"
        return 0
    else
        print_error "MySQL is not installed"
        return 1
    fi
}

# Install MySQL based on OS
install_mysql() {
    print_info "Installing MySQL..."
    
    case $OS in
        "macos")
            if command -v brew &> /dev/null; then
                print_info "Installing MySQL using Homebrew..."
                brew install mysql
                brew services start mysql
            else
                print_error "Homebrew not found. Please install Homebrew first:"
                echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        "linux")
            print_info "Installing MySQL on Linux..."
            if command -v apt-get &> /dev/null; then
                sudo apt-get update
                sudo apt-get install -y mysql-server
                sudo systemctl start mysql
                sudo systemctl enable mysql
            elif command -v yum &> /dev/null; then
                sudo yum install -y mysql-server
                sudo systemctl start mysqld
                sudo systemctl enable mysqld
            else
                print_error "Unsupported Linux distribution. Please install MySQL manually."
                exit 1
            fi
            ;;
        "windows")
            print_info "Please install MySQL manually on Windows:"
            echo "   1. Download from: https://dev.mysql.com/downloads/mysql/"
            echo "   2. Run the installer"
            echo "   3. Start MySQL service"
            exit 1
            ;;
        *)
            print_error "Unsupported operating system"
            exit 1
            ;;
    esac
}

# Secure MySQL installation
secure_mysql() {
    print_info "Securing MySQL installation..."
    
    # Generate a random password
    MYSQL_ROOT_PASSWORD=$(openssl rand -base64 12)
    
    print_info "Setting up MySQL root password..."
    
    case $OS in
        "macos")
            mysql_secure_installation
            ;;
        "linux")
            # For Ubuntu/Debian
            if command -v mysql_secure_installation &> /dev/null; then
                sudo mysql_secure_installation
            else
                # Manual secure installation
                sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
                sudo mysql -e "DELETE FROM mysql.user WHERE User='';"
                sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
                sudo mysql -e "DROP DATABASE IF EXISTS test;"
                sudo mysql -e "FLUSH PRIVILEGES;"
                
                print_status "MySQL secured with root password: $MYSQL_ROOT_PASSWORD"
                print_warning "Please save this password and update your .env file!"
            fi
            ;;
    esac
}

# Create database and user
setup_database() {
    print_info "Setting up database..."
    
    # Try to connect without password first
    if mysql -u root -e "SELECT 1;" &> /dev/null; then
        print_status "MySQL accessible without password"
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS bookstore_admin;"
        print_status "Database 'bookstore_admin' created"
        
        # Update .env file
        if [ -f "backend/.env" ]; then
            sed -i.bak 's/DB_PASSWORD=.*/DB_PASSWORD=/' backend/.env
            print_status "Updated .env file (no password)"
        fi
    else
        print_warning "MySQL requires password. Please enter your MySQL root password:"
        read -s MYSQL_PASSWORD
        
        if mysql -u root -p"$MYSQL_PASSWORD" -e "SELECT 1;" &> /dev/null; then
            print_status "MySQL password accepted"
            mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS bookstore_admin;"
            print_status "Database 'bookstore_admin' created"
            
            # Update .env file
            if [ -f "backend/.env" ]; then
                sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" backend/.env
                print_status "Updated .env file with password"
            fi
        else
            print_error "Invalid MySQL password"
            exit 1
        fi
    fi
}

# Main execution
main() {
    if ! check_mysql_installation; then
        print_warning "MySQL not found. Installing..."
        install_mysql
    fi
    
    # Wait a moment for MySQL to start
    sleep 2
    
    # Try to secure MySQL
    secure_mysql
    
    # Setup database
    setup_database
    
    print_status "Database setup completed!"
    echo ""
    print_info "You can now run: npm run dev"
    print_info "Login credentials: admin@bookstore.com / admin123"
}

# Run main function
main 