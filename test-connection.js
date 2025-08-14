// Test database connection for MySQL Workbench
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bookstore_db',
    port: parseInt(process.env.DB_PORT) || 3306,
  };

  console.log('🔍 Testing MySQL Workbench connection...');
  console.log('Config:', {
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
    hasPassword: !!config.password
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');

    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows[0]);

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tables found:', tables.length);

    await connection.end();
    console.log('✅ All tests passed! Your MySQL Workbench setup is working.');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Please check your .env file and MySQL Workbench connection.');
  }
}

testConnection(); 