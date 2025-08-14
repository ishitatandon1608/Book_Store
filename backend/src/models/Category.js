const { pool } = require('../config/database');
const logger = require('../config/logger');

class Category {
  static async create(categoryData) {
    try {
      const { name, description } = categoryData;

      const query = `
        INSERT INTO categories (name, description, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
      `;

      const [result] = await pool.execute(query, [name, description]);

      logger.info('Category created successfully', { categoryId: result.insertId, name });

      return await this.findById(result.insertId);
    } catch (error) {
      logger.error('Error creating category', { error: error.message, name: categoryData.name });
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM categories WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);

      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding category by ID', { error: error.message, id });
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT * FROM categories 
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (name LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await pool.execute(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM categories WHERE 1=1';
      if (search) {
        countQuery += ` AND (name LIKE ? OR description LIKE ?)`;
      }
      const [countResult] = await pool.execute(countQuery, search ? [`%${search}%`, `%${search}%`] : []);

      return {
        categories: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting all categories', { error: error.message });
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { name, description } = updateData;

      const query = `
        UPDATE categories 
        SET name = ?, description = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, [name, description, id]);

      if (result.affectedRows === 0) {
        throw new Error('Category not found');
      }

      logger.info('Category updated successfully', { categoryId: id, name });

      return await this.findById(id);
    } catch (error) {
      logger.error('Error updating category', { error: error.message, categoryId: id });
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Check if category has books
      const [books] = await pool.execute('SELECT COUNT(*) as count FROM books WHERE category_id = ?', [id]);

      if (books[0].count > 0) {
        throw new Error('Cannot delete category with associated books');
      }

      const query = 'DELETE FROM categories WHERE id = ?';
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('Category not found');
      }

      logger.info('Category deleted successfully', { categoryId: id });

      return true;
    } catch (error) {
      logger.error('Error deleting category', { error: error.message, categoryId: id });
      throw error;
    }
  }

  static async getWithCount() {
    try {
      const query = `
        SELECT c.*, COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;

      const [rows] = await pool.execute(query);

      return {
        categories: rows,
        pagination: {
          page: 1,
          limit: rows.length,
          total: rows.length,
          totalPages: 1
        }
      };
    } catch (error) {
      logger.error('Error getting categories with count', { error: error.message });
      throw error;
    }
  }
}

module.exports = Category; 