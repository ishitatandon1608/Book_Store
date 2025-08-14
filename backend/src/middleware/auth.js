const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Access attempt without token', { ip: req.ip, path: req.path });
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    logger.info('Token verified successfully', {
      userId: decoded.id,
      email: decoded.email,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Token verification failed', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });

    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = {
  authenticateToken,
  generateToken
}; 