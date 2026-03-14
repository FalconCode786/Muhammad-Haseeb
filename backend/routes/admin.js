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
const { getAdminUsers, updateAdminUser } = require('../controllers/adminUserController');
const { superAdminOnly } = require('../middleware/auth');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

// All routes protected by auth middleware (added in server.js)

router.use(adminLimiter);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Activity
router.get('/activity', getActivityFeed);

// Analytics
router.get('/analytics/projects', getProjectAnalytics);
router.get('/analytics/consultations', getConsultationAnalytics);

// Export
router.get('/export/:type', exportData);

// Admin users
router.get('/users', getAdminUsers);
router.patch('/users/:id', superAdminOnly, updateAdminUser);

module.exports = router;
