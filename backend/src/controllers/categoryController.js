const Category = require('../models/Category');
const logger = require('../config/logger');

const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const category = await Category.create(categoryData);

    logger.info('Category created', { categoryId: category.id, name: category.name, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    logger.error('Create category error', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await Category.getAll(parseInt(page), parseInt(limit), search);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get all categories error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    logger.error('Get category by ID error', { error: error.message, categoryId: req.params.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.update(id, updateData);

    logger.info('Category updated', { categoryId: id, name: category.name, userId: req.user.id });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    logger.error('Update category error', { error: error.message, categoryId: req.params.id, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.delete(id);

    logger.info('Category deleted', { categoryId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (error.message === 'Cannot delete category with existing books') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing books'
      });
    }

    logger.error('Delete category error', { error: error.message, categoryId: req.params.id, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllCategoriesSimple = async (req, res) => {
  try {
    const categories = await Category.getAllSimple();

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    logger.error('Get simple categories error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getCategoriesWithBookCount = async (req, res) => {
  try {
    const categories = await Category.getWithBookCount();

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    logger.error('Get categories with book count error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesSimple,
  getCategoriesWithBookCount
}; 