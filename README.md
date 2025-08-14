# 📚 Bookstore Admin Panel

A modern, full-stack web application for managing bookstore inventory with a beautiful React frontend and Node.js backend.

## ✨ Features

- **🔐 JWT Authentication** - Secure login/logout system
- **📊 Dashboard** - Real-time statistics and overview
- **📚 Books Management** - CRUD operations with photo upload
- **🏷️ Categories Management** - Organize books by categories
- **📱 Responsive Design** - Works on all devices
- **🎨 Modern UI** - Beautiful, colorful interface
- **🔍 Search & Filter** - Find books and categories easily
- **📈 Stock Management** - Track inventory levels
- **🖼️ Image Upload** - Add book cover images

## 🚀 Quick Start (MySQL Workbench)

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL Workbench** (with MySQL server running)
- **npm** or **yarn**

### 1. Database Setup

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Run the setup script:**
   - Open `setup-mysql-workbench.sql` in MySQL Workbench
   - Click the lightning bolt icon to execute the script
   - This creates the database and all tables

### 2. Configure Environment

Edit `backend/.env` file with your MySQL credentials:

```env
# Database Configuration - Update these with your MySQL Workbench credentials
DB_HOST=localhost
DB_USER=root                    # Your MySQL username
DB_PASSWORD=your_password       # Your MySQL password
DB_NAME=bookstore_db           # Database name
DB_PORT=3306                   # Default MySQL port
```

### 3. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### 4. Test Connection (Optional)

```bash
# Test your database connection
node test-connection.js
```

### 5. Start the Application

```bash
# Start both frontend and backend
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Login:** admin@bookstore.com / admin123

## ✅ What You Can Do

After setup, you'll be able to:
- ✅ Login to the admin panel
- ✅ Add new categories
- ✅ Add new books
- ✅ Edit existing books and categories
- ✅ Delete books and categories
- ✅ View all data in a beautiful interface

## 📁 Project Structure

```
bookstore-admin/
├── frontend/                 # React frontend
├── backend/                  # Node.js backend
├── setup-mysql-workbench.sql # Database setup script
├── test-connection.js        # Connection test script
├── MYSQL_WORKBENCH_SETUP.md  # Detailed setup guide
└── package.json             # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Update with your MySQL Workbench credentials)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookstore_db
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
```

## 🛠️ Available Scripts

### Root Directory
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run install:all      # Install all dependencies
```

### Testing
```bash
node test-connection.js  # Test database connection
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with pagination)
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get book by ID
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🐛 Troubleshooting

### Database Connection Issues
1. **Check MySQL Workbench connection:**
   - Make sure MySQL server is running
   - Verify your connection in MySQL Workbench

2. **Check .env file:**
   - Verify username and password
   - Check database name matches
   - Ensure port is correct (usually 3306)

3. **Test connection:**
   ```bash
   node test-connection.js
   ```

### Common Issues:
- **Wrong password:** Update `DB_PASSWORD` in `.env`
- **Wrong username:** Update `DB_USER` in `.env`
- **Database doesn't exist:** Run `setup-mysql-workbench.sql`
- **Port issues:** Make sure MySQL is running on port 3306

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📊 Database Schema

The application uses these tables (created by `setup-mysql-workbench.sql`):

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  category_id INT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Run `node test-connection.js` to test your database connection
3. Verify your MySQL Workbench connection
4. Check your `.env` file configuration
5. Open an issue with detailed error information

## 📖 Detailed Setup Guide

For more detailed instructions, see [MYSQL_WORKBENCH_SETUP.md](MYSQL_WORKBENCH_SETUP.md) 