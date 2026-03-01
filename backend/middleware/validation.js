const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Helper to format errors
const formatErrors = (errors) => {
  return errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));
};

// Contact form validation
const validateContact = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
    .escape(),

  body('contactNumber')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number')
    .escape(),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('projectType')
    .optional()
    .trim()
    .escape(),

  body('projectName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Project name cannot exceed 200 characters')
    .escape(),

  body('duration')
    .optional()
    .trim()
    .escape(),

  body('database')
    .optional()
    .trim()
    .escape(),

  body('uiLink')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (value && !validator.isURL(value)) {
        throw new Error('Please provide a valid URL');
      }
      return true;
    }),

  body('technologies')
    .optional()
    .trim()
    .escape(),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
    .escape(),

  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formatErrors(errors)
      });
    }
    next();
  }
];

// Consultation validation
const validateConsultation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required')
    .escape(),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Please provide a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (date < now) {
        throw new Error('Date cannot be in the past');
      }
      return true;
    }),

  body('time')
    .trim()
    .notEmpty().withMessage('Time is required')
    .escape(),

  body('type')
    .optional()
    .isIn(['video', 'phone', 'chat']).withMessage('Invalid consultation type'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formatErrors(errors)
      });
    }
    next();
  }
];

module.exports = {
  validateContact,
  validateConsultation
};