const { executeQuery, executeQueryWithRows } = require('../config/database');
const logger = require('../config/logger');

class Category {
  static async create(categoryData) {
    try {
      const { name, description } = categoryData;

      const query = `
        INSERT INTO categories (name, description, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
      `;

      const result = await executeQuery(query, [name, description || null]);

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
      const rows = await executeQueryWithRows(query, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding category by ID', { error: error.message, id });
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

      const result = await executeQuery(query, [name, description || null, id]);

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
      const booksQuery = 'SELECT COUNT(*) as count FROM books WHERE category_id = ?';
      const booksResult = await executeQueryWithRows(booksQuery, [id]);

      if (booksResult[0].count > 0) {
        throw new Error('Cannot delete category with existing books');
      }

      const query = 'DELETE FROM categories WHERE id = ?';
      const result = await executeQuery(query, [id]);

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

  static async getAll(page = 1, limit = 10, search = '') {
    try {
      // Ensure parameters are properly converted to numbers
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      let query = 'SELECT * FROM categories';
      let countQuery = 'SELECT COUNT(*) as total FROM categories';
      let params = [];
      let countParams = [];

      if (search) {
        query += ' WHERE name LIKE ? OR description LIKE ?';
        countQuery += ' WHERE name LIKE ? OR description LIKE ?';
        const searchParam = `%${search}%`;
        params = [searchParam, searchParam];
        countParams = [searchParam, searchParam];
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      const rows = await executeQueryWithRows(query, params);
      const countResult = await executeQueryWithRows(countQuery, countParams);

      return {
        categories: rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limitNum)
        }
      };
    } catch (error) {
      logger.error('Error getting all categories', { error: error.message });
      throw error;
    }
  }

  static async getAllSimple() {
    try {
      const query = 'SELECT id, name FROM categories ORDER BY name ASC';
      const rows = await executeQueryWithRows(query);
      return rows;
    } catch (error) {
      logger.error('Error getting simple categories', { error: error.message });
      throw error;
    }
  }

  static async getWithBookCount() {
    try {
      const query = `
        SELECT 
          c.id, 
          c.name, 
          c.description, 
          c.created_at, 
          c.updated_at,
          COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
      `;
      const rows = await executeQueryWithRows(query);
      return rows;
    } catch (error) {
      logger.error('Error getting categories with book count', { error: error.message });
      throw error;
    }
  }
}

module.exports = Category; 