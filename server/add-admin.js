import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const addAdmin = async (email, password, firstName = 'Admin', lastName = 'User') => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-king');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (existingAdmin) {
      console.log('⚠️  Admin with this email already exists');
      console.log('Existing admin:', {
        name: `${existingAdmin.firstName} ${existingAdmin.lastName}`,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }

    // Create new admin
    const admin = new Admin({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isActive: true,
      permissions: {
        userManagement: true,
        courseManagement: true,
        analytics: true,
        settings: true,
        notifications: true
      },
      profile: {
        bio: 'System Administrator',
        department: 'IT',
        position: 'Admin'
      }
    });

    await admin.save();
    console.log('✅ New admin created successfully');
    console.log('Admin details:', {
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive
    });

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node add-admin.js <email> <password> [firstName] [lastName]');
  console.log('Example: node add-admin.js admin2@example.com password123 John Doe');
  process.exit(1);
}

const [email, password, firstName, lastName] = args;

// Run the add function
addAdmin(email, password, firstName, lastName);
