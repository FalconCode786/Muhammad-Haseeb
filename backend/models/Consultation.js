const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    // Step 1: Personal Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: ['UI/UX Design Project', 'Full Stack Development', 'AI Automation Solution', 'Mobile App Development', 'Database Architecture', 'Performance Optimization', 'General Inquiry', 'Other']
    },

    // Step 2: Schedule
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    type: {
      type: String,
      enum: ['video', 'phone', 'chat'],
      default: 'video'
    },

    // Step 3: Additional
    message: {
      type: String,
      trim: true,
      default: ''
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    adminNotes: {
      type: String,
      default: ''
    },
    reminderSent: {
      type: Boolean,
      default: false
    },

    // Metadata
    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Prevent double bookings for active consultations (allow rebooking cancelled/no-show slots)
consultationSchema.index(
  { date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed', 'completed'] }
    }
  }
);
consultationSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);
