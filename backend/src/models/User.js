const { pool } = require('../config/database');
const logger = require('../config/logger');

class User {
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email', { error: error.message, email });
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID', { error: error.message, id });
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { name, email, password, role = 'user' } = userData;

      const query = `
        INSERT INTO users (name, email, password, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;

      const [result] = await pool.execute(query, [name, email, password, role]);

      logger.info('User created successfully', { userId: result.insertId, email });

      return await this.findById(result.insertId);
    } catch (error) {
      logger.error('Error creating user', { error: error.message, email: userData.email });
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { name, email, role } = updateData;

      const query = `
        UPDATE users 
        SET name = ?, email = ?, role = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, [name, email, role, id]);

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      logger.info('User updated successfully', { userId: id, email });

      return await this.findById(id);
    } catch (error) {
      logger.error('Error updating user', { error: error.message, userId: id });
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      logger.info('User deleted successfully', { userId: id });

      return true;
    } catch (error) {
      logger.error('Error deleting user', { error: error.message, userId: id });
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      const [rows] = await pool.execute(query, [limit, offset]);

      // Get total count
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM users');

      return {
        users: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting all users', { error: error.message });
      throw error;
    }
  }
}

module.exports = User; 