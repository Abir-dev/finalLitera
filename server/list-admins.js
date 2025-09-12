import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const listAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-king');
    console.log('✅ Connected to MongoDB');

    // Get all admins
    const admins = await Admin.find()
      .select('-password -loginAttempts -lockUntil')
      .sort({ createdAt: -1 });

    if (admins.length === 0) {
      console.log('📋 No admins found in the database');
      return;
    }

    console.log(`📋 Found ${admins.length} admin(s):\n`);

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Admin Details:`);
      console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive ? '✅' : '❌'}`);
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
      console.log(`   Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleDateString() : 'Never'}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('❌ Error listing admins:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the list function
listAdmins();
