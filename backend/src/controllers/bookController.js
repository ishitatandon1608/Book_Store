const Book = require('../models/Book');
const logger = require('../config/logger');

const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    const book = await Book.create(bookData);

    logger.info('Book created', { bookId: book.id, title: book.title, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });
  } catch (error) {
    logger.error('Create book error', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category_id } = req.query;

    const result = await Book.getAll(parseInt(page), parseInt(limit), search, category_id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get all books error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: { book }
    });
  } catch (error) {
    logger.error('Get book by ID error', { error: error.message, bookId: req.params.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.update(id, updateData);

    logger.info('Book updated', { bookId: id, title: book.title, userId: req.user.id });

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book }
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    logger.error('Update book error', { error: error.message, bookId: req.params.id, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.delete(id);

    logger.info('Book deleted', { bookId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    logger.error('Delete book error', { error: error.message, bookId: req.params.id, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    const book = await Book.updateStock(id, quantity);

    logger.info('Book stock updated', { bookId: id, newQuantity: quantity, userId: req.user.id });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { book }
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    logger.error('Update stock error', { error: error.message, bookId: req.params.id, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getLowStockBooks = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    const books = await Book.getLowStock(parseInt(threshold));

    res.json({
      success: true,
      data: { books, threshold: parseInt(threshold) }
    });
  } catch (error) {
    logger.error('Get low stock books error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const books = await Book.getByCategory(categoryId);

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    logger.error('Get books by category error', { error: error.message, categoryId: req.params.categoryId });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateStock,
  getLowStockBooks,
  getBooksByCategory
}; 