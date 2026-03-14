const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set. Configure it in your .env file.');
  }

  const conn = await mongoose.connect(mongoUri);

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  console.log(`📁 Database: ${conn.connection.name}`);
};

module.exports = connectDB;
