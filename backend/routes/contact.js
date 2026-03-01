const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { validateContact } = require('../middleware/validation');

// Public route - submit contact form
router.post('/', validateContact, submitContact);

// Protected routes (will add auth middleware in Phase 5)
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;