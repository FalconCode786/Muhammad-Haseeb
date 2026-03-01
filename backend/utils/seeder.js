const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = require('../config/database');

// Create initial super admin
const createSuperAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      name: 'Muhammad Haseeb',
      email: 'haseeb@admin.com',
      password: 'Admin@123456',
      role: 'superadmin'
    };

    // Check if exists
    const exists = await User.findOne({ email: adminData.email });
    if (exists) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${adminData.email}`);
      process.exit(0);
    }

    const admin = await User.create(adminData);
    
    console.log('✅ Super admin created successfully!');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log('\n🔐 Login with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run seeder
createSuperAdmin();