const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getDashboardStats,
  getActivityFeed,
  getProjectAnalytics,
  getConsultationAnalytics,
  exportData
} = require('../controllers/dashboardController');
const { getUsers, updateUser } = require('../controllers/userController');
const { superAdminOnly } = require('../middleware/auth');

// All routes protected by auth middleware (added in server.js)
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(adminRateLimit);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Activity
router.get('/activity', getActivityFeed);

// Analytics
router.get('/analytics/projects', getProjectAnalytics);
router.get('/analytics/consultations', getConsultationAnalytics);

// Export
router.get('/export/:type', exportData);

// Users & roles
router.get('/users', getUsers);
router.put('/users/:id', superAdminOnly, updateUser);

module.exports = router;
