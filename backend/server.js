const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { protect, adminOnly } = require('./middleware/auth');

// Route imports
const contactRoutes = require('./routes/contact');
const consultationRoutes = require('./routes/consultation');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', protect, adminOnly, adminRoutes);
// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
// Utility helper for manual admin creation (not invoked by default)
const createAdmin = async () => {
  const User = require('./models/User');
  await User.create({
    name: 'Muhammad Haseeb',
    email: 'admin@haseeb.dev',
    password: 'your-secure-password',
    role: 'admin'
  });
  console.log('Admin created');
};
