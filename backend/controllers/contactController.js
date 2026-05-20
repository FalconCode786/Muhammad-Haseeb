const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');
const { sanitizeInput } = require('../utils/helpers');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    // Get client IP and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Sanitize inputs
    const contactData = {
      fullName: sanitizeInput(req.body.fullName),
      contactNumber: sanitizeInput(req.body.contactNumber),
      email: req.body.email ? sanitizeInput(req.body.email.toLowerCase()) : undefined,
      projectType: sanitizeInput(req.body.projectType),
      projectName: sanitizeInput(req.body.projectName),
      duration: sanitizeInput(req.body.duration),
      database: sanitizeInput(req.body.database),
      uiLink: req.body.uiLink || undefined,
      technologies: sanitizeInput(req.body.technologies),
      message: sanitizeInput(req.body.message),
      ipAddress,
      userAgent
    };

    // Save to database
    const contact = await Contact.create(contactData);

    // Send emails (don't wait for these to respond)
    sendEmails(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. I will get back to you within 24 hours.',
      data: {
        id: contact._id,
        fullName: contact.fullName,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this request'
      });
    }

    return next(error);
  }
};

// Send notification emails
const sendEmails = async (contactData) => {
  try {
    // Send to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      ...emailTemplates.adminContactNotification(contactData)
    });

    // Send confirmation to user (if email provided)
    if (contactData.email) {
      await sendEmail({
        to: contactData.email,
        ...emailTemplates.userConfirmation(contactData)
      });
    }

    console.log('✅ Contact form emails sent successfully');
  } catch (error) {
    console.error('❌ Failed to send emails:', error);
    // Don't throw - we don't want to fail the request if email fails
  }
};

// @desc    Get all contacts (for admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    return next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContact = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Get contact stats
// @route   GET /api/contact/stats
// @access  Private/Admin
const getContactStats = async (req, res, next) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Contact.countDocuments();
    const thisMonth = await Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        total,
        thisMonth,
        byStatus: stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getContactStats
};
