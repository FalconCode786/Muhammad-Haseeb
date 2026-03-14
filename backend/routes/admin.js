const express = require('express');
const router = express.Router();
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
