const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// CRUD operations
router.post('/', validateCategory, categoryController.createCategory);
router.get('/simple', categoryController.getAllCategoriesSimple);
router.get('/with-count', categoryController.getCategoriesWithBookCount);
router.get('/with-book-count', categoryController.getCategoriesWithBookCount);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 