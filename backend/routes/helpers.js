// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time
const formatTime = (time) => {
  return time;
};

// Generate random string
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Sanitize input - prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  return { skip, limit: Number(limit) };
};

// Generate JWT token (will use in Phase 5)
const generateToken = (payload) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token (will use in Phase 5)
const verifyToken = (token) => {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  formatDate,
  formatTime,
  generateRandomString,
  sanitizeInput,
  getPagination,
  generateToken,
  verifyToken
};