const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set. Configure it in your .env file.');
  }

  try {
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
