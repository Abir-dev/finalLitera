import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid admin credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(423).json({
        status: 'error',
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Admin account is deactivated'
      });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        status: 'error',
        message: 'Invalid admin credentials'
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: 'admin' 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRE }
    );

    // Prepare admin data (exclude password)
    const adminData = {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      permissions: admin.permissions,
      profile: admin.profile,
      lastLogin: admin.lastLogin
    };

    res.status(200).json({
      status: 'success',
      message: 'Admin login successful',
      data: {
        admin: adminData,
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during admin login'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id)
      .select('-password -loginAttempts -lockUntil');

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'profile', 
      'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin profile updated successfully',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during profile update'
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private/Admin
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'New password must be at least 6 characters long'
      });
    }

    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during password change'
    });
  }
};

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin/admins
// @access  Private/SuperAdmin
export const getAllAdmins = async (req, res) => {
  try {
    // Check if current admin is superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admins = await Admin.find()
      .select('-password -loginAttempts -lockUntil')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Admin.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        admins,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAdmins: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create new admin (Super Admin only)
// @route   POST /api/admin/admins
// @access  Private/SuperAdmin
export const createAdmin = async (req, res) => {
  try {
    // Check if current admin is superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const { firstName, lastName, email, password, role, permissions } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'First name, last name, email, and password are required'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = new Admin({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || 'admin',
      permissions: permissions || {
        userManagement: true,
        courseManagement: true,
        analytics: true,
        settings: true,
        notifications: true
      }
    });

    await admin.save();

    // Return admin data without password
    const adminData = {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
      createdAt: admin.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully',
      data: {
        admin: adminData
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during admin creation'
    });
  }
};

// @desc    Update admin (Super Admin only)
// @route   PUT /api/admin/admins/:id
// @access  Private/SuperAdmin
export const updateAdmin = async (req, res) => {
  try {
    // Check if current admin is superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'role', 
      'isActive', 
      'permissions', 
      'profile'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin updated successfully',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during admin update'
    });
  }
};

// @desc    Delete admin (Super Admin only)
// @route   DELETE /api/admin/admins/:id
// @access  Private/SuperAdmin
export const deleteAdmin = async (req, res) => {
  try {
    // Check if current admin is superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Super admin privileges required.'
      });
    }

    // Prevent self-deletion
    if (req.admin.id === req.params.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete your own account'
      });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during admin deletion'
    });
  }
};
