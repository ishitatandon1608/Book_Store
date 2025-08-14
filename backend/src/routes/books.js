const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/auth');
const { validateBook } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// CRUD operations
router.post('/', validateBook, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/low-stock', bookController.getLowStockBooks);
router.get('/category/:categoryId', bookController.getBooksByCategory);
router.get('/:id', bookController.getBookById);
router.put('/:id', validateBook, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Stock management
router.patch('/:id/stock', bookController.updateStock);

module.exports = router; 