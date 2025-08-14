require('dotenv').config();
const mysql = require('mysql2/promise');
const logger = require('./logger');

// Simple database configuration without pooling
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookstore_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  // Remove all pooling options for simple connections
};

// Create a simple connection function
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('❌ Failed to create database connection:', error.message);
    console.error('Please check your MySQL Workbench credentials in .env file');
    throw error;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await createConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to database: ${dbConfig.database}`);

    // Initialize database tables if they don't exist
    await initializeDatabase(connection);

    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database credentials in .env file');
    console.error('Current config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      hasPassword: !!dbConfig.password
    });
    console.error('Common solutions:');
    console.error('1. Make sure MySQL is running in MySQL Workbench');
    console.error('2. Check your username and password in .env file');
    console.error('3. Run setup-mysql-workbench.sql in MySQL Workbench');
    console.error('4. Verify database name matches in .env file');
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async (connection) => {
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create books table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
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
      )
    `);

    // Check if admin user exists, if not create one
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@bookstore.com']
    );

    if (adminUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await connection.execute(`
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
      `, ['Admin User', 'admin@bookstore.com', hashedPassword, 'admin']);

      console.log('✅ Admin user created: admin@bookstore.com / admin123');
    }

    // Check if default categories exist, if not create them
    const [categories] = await connection.execute('SELECT id FROM categories');

    if (categories.length === 0) {
      await connection.execute(`
        INSERT INTO categories (name, description) VALUES 
        ('Fiction', 'Fictional literature including novels and short stories'),
        ('Non-Fiction', 'Non-fictional books including biographies, history, and science'),
        ('Science Fiction', 'Science fiction and fantasy books'),
        ('Mystery', 'Mystery and thriller books'),
        ('Romance', 'Romance novels'),
        ('Biography', 'Biographies and autobiographies')
      `);
      console.log('✅ Default categories created');
    }

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
};

// Execute query with automatic connection management
const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await createConnection();

    // Use query instead of execute for better compatibility
    const [results] = await connection.query(query, params);
    return results;
  } catch (error) {
    logger.error('Database query error:', { error: error.message, query });
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Execute query that returns rows
const executeQueryWithRows = async (query, params = []) => {
  let connection;
  try {
    connection = await createConnection();

    // Use query instead of execute for better compatibility with LIMIT/OFFSET
    const [rows] = await connection.query(query, params);
    return rows;
  } catch (error) {
    logger.error('Database query error:', { error: error.message, query });
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  createConnection,
  executeQuery,
  executeQueryWithRows,
  testConnection,
  isMockMode: () => false
}; 