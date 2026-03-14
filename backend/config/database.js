const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed. Check MONGODB_URI configuration:', error);
    const connectionError = new Error('Database connection failed. Check MONGODB_URI configuration.');
    connectionError.cause = error;
    connectionError.stack = error.stack;
    throw connectionError;
  }
};

module.exports = connectDB;
