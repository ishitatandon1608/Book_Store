const { executeQuery, executeQueryWithRows } = require('../config/database');
const logger = require('../config/logger');

class Book {
  static async create(bookData) {
    try {
      const { title, author, isbn, price, quantity, category_id, description, image_url } = bookData;

      const query = `
        INSERT INTO books (title, author, isbn, price, quantity, category_id, description, image_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const result = await executeQuery(query, [
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
      const rows = await executeQueryWithRows(query, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding book by ID', { error: error.message, id });
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

      const result = await executeQuery(query, [
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
      const result = await executeQuery(query, [id]);

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

  static async getAll(page = 1, limit = 10, search = '', category_id = null) {
    try {
      console.log('Book.getAll received params:', { page, limit, search, category_id, pageType: typeof page, limitType: typeof limit });

      // Handle undefined/null parameters
      const pageNum = page ? parseInt(page) || 1 : 1;
      const limitNum = limit ? parseInt(limit) || 10 : 10;
      const offset = (pageNum - 1) * limitNum;

      console.log('Book.getAll processed params:', { pageNum, limitNum, offset, pageNumType: typeof pageNum, limitNumType: typeof limitNum, offsetType: typeof offset });

      let query = `
        SELECT b.*, c.name as category_name 
        FROM books b 
        LEFT JOIN categories c ON b.category_id = c.id
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM books b';
      let whereConditions = [];
      let params = [];
      let countParams = [];

      if (search) {
        whereConditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)');
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
        countParams.push(searchParam, searchParam, searchParam);
      }

      if (category_id) {
        whereConditions.push('b.category_id = ?');
        params.push(category_id);
        countParams.push(category_id);
      }

      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
      }

      query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      console.log('Book.getAll final query params:', { query, params, limitNum, offset });

      const rows = await executeQueryWithRows(query, params);
      const countResult = await executeQueryWithRows(countQuery, countParams);

      return {
        books: rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limitNum)
        }
      };
    } catch (error) {
      logger.error('Error getting all books', { error: error.message });
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
      const rows = await executeQueryWithRows(query, [threshold]);
      return rows;
    } catch (error) {
      logger.error('Error getting low stock books', { error: error.message });
      throw error;
    }
  }

  static async updateStock(id, quantity) {
    try {
      const query = 'UPDATE books SET quantity = ?, updated_at = NOW() WHERE id = ?';
      const result = await executeQuery(query, [quantity, id]);

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

  static async getStats() {
    try {
      const totalBooksQuery = 'SELECT COUNT(*) as total FROM books';
      const totalCategoriesQuery = 'SELECT COUNT(*) as total FROM categories';
      const lowStockQuery = 'SELECT COUNT(*) as total FROM books WHERE quantity <= 10';
      const totalValueQuery = 'SELECT SUM(price * quantity) as total FROM books';

      const [totalBooks, totalCategories, lowStock, totalValue] = await Promise.all([
        executeQueryWithRows(totalBooksQuery),
        executeQueryWithRows(totalCategoriesQuery),
        executeQueryWithRows(lowStockQuery),
        executeQueryWithRows(totalValueQuery)
      ]);

      return {
        totalBooks: totalBooks[0].total,
        totalCategories: totalCategories[0].total,
        lowStockBooks: lowStock[0].total,
        totalValue: totalValue[0].total || 0
      };
    } catch (error) {
      logger.error('Error getting book stats', { error: error.message });
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
      const rows = await executeQueryWithRows(query, [categoryId]);
      return rows;
    } catch (error) {
      logger.error('Error getting books by category', { error: error.message, categoryId });
      throw error;
    }
  }
}

module.exports = Book; 