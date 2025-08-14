const bcrypt = require('bcryptjs');
const { createConnection } = require('./backend/src/config/database');

async function createNewAdmin() {
  try {
    const connection = await createConnection();

    // New admin user data - CHANGE THESE VALUES
    const newAdminData = {
      name: 'Second Admin',
      email: 'admin2@bookstore.com',
      password: 'admin456',
      phone: '9876543210',
      role: 'admin'
    };

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [newAdminData.email]
    );

    if (existingUsers.length > 0) {
      console.log('❌ User with this email already exists!');
      await connection.end();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newAdminData.password, 10);

    // Insert the new admin user
    const query = `
      INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await connection.execute(query, [
      newAdminData.name,
      newAdminData.email,
      hashedPassword,
      newAdminData.phone,
      newAdminData.role
    ]);

    console.log('✅ New admin user created successfully!');
    console.log('📧 Email:', newAdminData.email);
    console.log('🔑 Password:', newAdminData.password);
    console.log('🆔 User ID:', result.insertId);
    console.log('');
    console.log('🎉 You can now login with:');
    console.log('   Email: ' + newAdminData.email);
    console.log('   Password: ' + newAdminData.password);

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createNewAdmin(); 