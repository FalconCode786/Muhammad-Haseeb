const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  const conn = await mongoose.connect(mongoUri);

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  console.log(`📁 Database: ${conn.connection.name}`);
};

module.exports = connectDB;
