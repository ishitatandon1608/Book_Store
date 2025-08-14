# 🗄️ MySQL Workbench Setup Guide

## Quick Setup for MySQL Workbench Users

### Step 1: Database Setup in MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Run the setup script:**
   - Open `setup-mysql-workbench.sql` in MySQL Workbench
   - Click the lightning bolt icon to execute the script
   - This will create the database and all tables

### Step 2: Update Environment File

Edit `backend/.env` file with your MySQL credentials:

```env
# Database Configuration - Update these with your MySQL Workbench credentials
DB_HOST=localhost
DB_USER=root                    # Your MySQL username
DB_PASSWORD=your_password       # Your MySQL password
DB_NAME=bookstore_db           # Database name (created by script)
DB_PORT=3306                   # Default MySQL port
```

### Step 3: Start the Application

```bash
# Install dependencies (if not done already)
npm run install:all

# Start both frontend and backend
npm run dev
```

### Step 4: Access the Application

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

## 🔧 Troubleshooting

### If you get connection errors:

1. **Check your MySQL credentials** in the `.env` file
2. **Verify MySQL is running** in MySQL Workbench
3. **Test connection** in MySQL Workbench first
4. **Check database name** matches in `.env` file

### Common Issues:

- **Wrong password:** Update `DB_PASSWORD` in `.env`
- **Wrong username:** Update `DB_USER` in `.env`
- **Database doesn't exist:** Run the `setup-mysql-workbench.sql` script
- **Port issues:** Make sure MySQL is running on port 3306

## 📝 Example .env Configuration

```env
# Example for a typical MySQL Workbench setup
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mypassword123
DB_NAME=bookstore_db
DB_PORT=3306
```

That's it! Just update the `.env` file with your MySQL Workbench credentials and everything will work perfectly. 