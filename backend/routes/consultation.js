const express = require('express');
const router = express.Router();
const {
  bookConsultation,
  getAvailableSlots,
  getConsultations,
  getConsultation,
  updateConsultation,
  cancelConsultation,
  getConsultationStats
} = require('../controllers/consultationController');
const { validateConsultation } = require('../middleware/validation');

// Public routes
router.post('/', validateConsultation, bookConsultation);
router.get('/available-slots', getAvailableSlots);

// Protected routes (will add auth in Phase 5)
router.get('/', getConsultations);
router.get('/stats', getConsultationStats);
router.get('/:id', getConsultation);
router.put('/:id', updateConsultation);
router.delete('/:id', cancelConsultation);

module.exports = router;