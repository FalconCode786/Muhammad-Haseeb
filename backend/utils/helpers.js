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

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  return { skip, limit: Number(limit) };
};

module.exports = {
  formatDate,
  formatTime,
  generateRandomString,
  sanitizeInput,
  getPagination
};