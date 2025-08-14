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

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookstore-admin
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE bookstore_admin;
   ```

2. **Configure Database Connection:**
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Edit `.env` file with your database credentials:**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=bookstore_admin
   DB_PORT=3306
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

### 4. Start the Application

#### Option A: Start Both Services (Recommended)
```bash
# From root directory
npm run dev
```

#### Option B: Start Services Separately
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### 6. Login Credentials

The system will automatically create an admin user on first run:
- **Email:** admin@bookstore.com
- **Password:** admin123

## 📁 Project Structure

```
bookstore-admin/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── index.css       # Global styles
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   ├── .env               # Environment variables
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bookstore_admin
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

#### Frontend
- **Proxy:** Configured to `http://localhost:5000` in package.json
- **API Base URL:** Automatically uses the proxy

## 📊 Database Schema

The application automatically creates the following tables:

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

## 🛠️ Available Scripts

### Root Directory
```bash
npm run dev          # Start both frontend and backend
npm run frontend     # Start only frontend
npm run backend      # Start only backend
```

### Frontend
```bash
npm start           # Start development server
npm run build       # Build for production
npm run eject       # Eject from Create React App
```

### Backend
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
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
- `PUT /api/books/:id/stock` - Update book stock
- `GET /api/books/low-stock` - Get low stock books

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/with-count` - Get categories with book count
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Colorful Themes** - Dynamic color schemes
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Interactive Elements** - Hover effects and animations
- **Photo Upload** - Drag-and-drop image upload
- **Search & Filter** - Advanced filtering capabilities
- **Real-time Updates** - Live data updates

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt password encryption
- **Rate Limiting** - API request throttling
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP header protection

## 🚀 Deployment

### Frontend (React)
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend (Node.js)
```bash
cd backend
npm start
# Deploy to your Node.js hosting service
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production database
4. Set up proper logging
5. Configure CORS for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console logs for errors
2. Verify database connection
3. Ensure all environment variables are set
4. Check if all dependencies are installed

## 🎯 Next Steps

- [ ] Add user management features
- [ ] Implement advanced reporting
- [ ] Add bulk import/export
- [ ] Create mobile app
- [ ] Add email notifications
- [ ] Implement backup system

---

**Happy Coding! 🚀** 