const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const logger = require('../config/logger');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      logger.warn('Login attempt with invalid email', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info('User logged in successfully', { userId: user.id, email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'admin'
    });

    // Generate JWT token
    const token = generateToken(user);

    logger.info('User registered successfully', { userId: user.id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get profile error', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    const updatedUser = await User.update(userId, { name, email, phone });

    logger.info('Profile updated successfully', { userId });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    logger.error('Update profile error', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile
}; 