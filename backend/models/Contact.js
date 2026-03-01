const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // Step 1: Personal Info (Required)
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    // Step 2: Project Info
    projectType: {
      type: String,
      enum: ['UI/UX Design', 'Full Stack Web App', 'AI Automation', 'Mobile App', 'Database Design', 'Other', ''],
      default: ''
    },
    projectName: {
      type: String,
      trim: true,
      default: ''
    },
    duration: {
      type: String,
      enum: ['Less than 1 week', '1-2 weeks', '2-4 weeks', '1-2 months', '3+ months', 'Ongoing', ''],
      default: ''
    },

    // Step 3: Technical Details
    database: {
      type: String,
      enum: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'Not Sure Yet', ''],
      default: ''
    },
    uiLink: {
      type: String,
      trim: true,
      default: ''
    },
    technologies: {
      type: String,
      trim: true,
      default: ''
    },

    // Step 4: Message
    message: {
      type: String,
      trim: true,
      default: ''
    },

    // Status tracking
    status: {
      type: String,
      enum: ['new', 'in-progress', 'responded', 'closed'],
      default: 'new'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Index for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);