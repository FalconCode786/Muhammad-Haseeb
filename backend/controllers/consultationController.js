const Consultation = require('../models/Consultation');
const { sendEmail, emailTemplates } = require('../config/email');
const { sanitizeInput } = require('../utils/helpers');

// Book consultation
const bookConsultation = async (req, res) => {
  try {
    const { name, email, topic, date, time, type, message } = req.body;

    // Check for existing booking
    const existingBooking = await Consultation.findOne({
      date: new Date(date),
      time: time,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const consultation = await Consultation.create({
      name: sanitizeInput(name),
      email: sanitizeInput(email.toLowerCase()),
      topic: sanitizeInput(topic),
      date: new Date(date),
      time,
      type: type || 'video',
      message: sanitizeInput(message),
      ipAddress
    });

    // Send emails
    sendConsultationEmails(consultation);

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully! Check your email for confirmation.',
      data: {
        id: consultation._id,
        name: consultation.name,
        date: consultation.date,
        time: consultation.time,
        status: consultation.status
      }
    });

  } catch (error) {
    console.error('Consultation booking error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to book consultation. Please try again.'
    });
  }
};

// Send emails
const sendConsultationEmails = async (data) => {
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      ...emailTemplates.adminConsultationNotification(data)
    });

    await sendEmail({
      to: data.email,
      ...emailTemplates.userConsultationConfirmation(data)
    });

    console.log('✅ Consultation emails sent');
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

// Get available slots
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const allSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', 
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    const booked = await Consultation.find({
      date: new Date(date),
      status: { $nin: ['cancelled', 'no-show'] }
    }).select('time');

    const bookedTimes = booked.map(b => b.time);
    const available = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.json({
      success: true,
      data: { date, availableSlots: available, bookedSlots: bookedTimes }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
};

// Get all consultations
const getConsultations = async (req, res) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      filter.status = { $nin: ['cancelled', 'completed'] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const consultations = await Consultation.find(filter)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Consultation.countDocuments(filter);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
};

// Get single consultation
const getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation'
    });
  }
};

// Update consultation
const updateConsultation = async (req, res) => {
  try {
    const { status, meetingLink, adminNotes } = req.body;
    const updateData = { updatedAt: Date.now() };
    
    if (status) updateData.status = status;
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation'
    });
  }
};

// Cancel consultation
const cancelConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    await sendEmail({
      to: consultation.email,
      subject: 'Consultation Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
          <h2 style="color: #dc2626;">Consultation Cancelled</h2>
          <p>Hi ${consultation.name},</p>
          <p>Your consultation scheduled for <strong>${new Date(consultation.date).toLocaleDateString()} at ${consultation.time}</strong> has been cancelled.</p>
          <p>Best regards,<br>Muhammad Haseeb</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Consultation cancelled successfully',
      data: consultation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation'
    });
  }
};

// Get stats
const getConsultationStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Consultation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const upcomingToday = await Consultation.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $nin: ['cancelled', 'completed'] }
    });

    const thisWeek = await Consultation.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
      status: { $nin: ['cancelled'] }
    });

    const total = await Consultation.countDocuments();

    res.json({
      success: true,
      data: {
        total,
        upcomingToday,
        thisWeek,
        byStatus: stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

module.exports = {
  bookConsultation,
  getAvailableSlots,
  getConsultations,
  getConsultation,
  updateConsultation,
  cancelConsultation,
  getConsultationStats
};