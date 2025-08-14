const { pool } = require('../config/database');
const logger = require('../config/logger');

class Book {
  static async create(bookData) {
    try {
      const { title, author, isbn, price, quantity, category_id, description, image_url } = bookData;

      const query = `
        INSERT INTO books (title, author, isbn, price, quantity, category_id, description, image_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [result] = await pool.execute(query, [
        title, author, isbn, price, quantity, category_id, description, image_url || null
      ]);

      logger.info('Book created successfully', { bookId: result.insertId, title });

      return await this.findById(result.insertId);
    } catch (error) {
      logger.error('Error creating book', { error: error.message, title: bookData.title });
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT b.*, c.name as category_name 
        FROM books b 
        LEFT JOIN categories c ON b.category_id = c.id 
        WHERE b.id = ?
      `;
      const [rows] = await pool.execute(query, [id]);

      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding book by ID', { error: error.message, id });
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10, search = '', category_id = null) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT b.*, c.name as category_name 
        FROM books b 
        LEFT JOIN categories c ON b.category_id = c.id 
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (category_id) {
        query += ` AND b.category_id = ?`;
        params.push(category_id);
      }

      query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await pool.execute(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM books b WHERE 1=1';
      const countParams = [];

      if (search) {
        countQuery += ` AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (category_id) {
        countQuery += ` AND b.category_id = ?`;
        countParams.push(category_id);
      }

      const [countResult] = await pool.execute(countQuery, countParams);

      return {
        books: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting all books', { error: error.message });
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { title, author, isbn, price, quantity, category_id, description, image_url } = updateData;

      const query = `
        UPDATE books 
        SET title = ?, author = ?, isbn = ?, price = ?, quantity = ?, 
            category_id = ?, description = ?, image_url = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, [
        title, author, isbn, price, quantity, category_id, description, image_url || null, id
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Book not found');
      }

      logger.info('Book updated successfully', { bookId: id, title });

      return await this.findById(id);
    } catch (error) {
      logger.error('Error updating book', { error: error.message, bookId: id });
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM books WHERE id = ?';
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('Book not found');
      }

      logger.info('Book deleted successfully', { bookId: id });

      return true;
    } catch (error) {
      logger.error('Error deleting book', { error: error.message, bookId: id });
      throw error;
    }
  }

  static async updateStock(id, quantity) {
    try {
      const query = 'UPDATE books SET quantity = ?, updated_at = NOW() WHERE id = ?';
      const [result] = await pool.execute(query, [quantity, id]);

      if (result.affectedRows === 0) {
        throw new Error('Book not found');
      }

      logger.info('Book stock updated', { bookId: id, newQuantity: quantity });

      return await this.findById(id);
    } catch (error) {
      logger.error('Error updating book stock', { error: error.message, bookId: id });
      throw error;
    }
  }

  static async getLowStock(threshold = 10) {
    try {
      const query = `
        SELECT b.*, c.name as category_name 
        FROM books b 
        LEFT JOIN categories c ON b.category_id = c.id 
        WHERE b.quantity <= ? 
        ORDER BY b.quantity ASC
      `;

      const [rows] = await pool.execute(query, [threshold]);

      return rows;
    } catch (error) {
      logger.error('Error getting low stock books', { error: error.message });
      throw error;
    }
  }

  static async getByCategory(categoryId) {
    try {
      const query = `
        SELECT b.*, c.name as category_name 
        FROM books b 
        LEFT JOIN categories c ON b.category_id = c.id 
        WHERE b.category_id = ?
        ORDER BY b.title ASC
      `;

      const [rows] = await pool.execute(query, [categoryId]);

      return rows;
    } catch (error) {
      logger.error('Error getting books by category', { error: error.message, categoryId });
      throw error;
    }
  }
}

module.exports = Book; 