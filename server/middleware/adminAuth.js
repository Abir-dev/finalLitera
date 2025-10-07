import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// @desc    Admin authentication middleware
// @access  Private
export const adminAuth = async (req, res, next) => {
  try {
    console.log('AdminAuth middleware called:', {
      url: req.url,
      method: req.method,
      authHeader: req.headers.authorization ? 'Present' : 'Missing'
    });

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format');
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('No token found in header');
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', { id: decoded.id, iat: decoded.iat });
    
    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      console.log('Admin not found:', decoded.id);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Admin not found.'
      });
    }

    if (!admin.isActive) {
      console.log('Admin account deactivated:', admin.email);
      return res.status(401).json({
        status: 'error',
        message: 'Admin account is deactivated.'
      });
    }

    // Add admin info to request object
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    console.log('Admin auth successful:', req.admin.email);
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired.'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Server error during authentication.'
    });
  }
};

// @desc    Super admin authorization middleware
// @access  Private/SuperAdmin
export const superAdminAuth = async (req, res, next) => {
  try {
    // First check if user is authenticated as admin
    if (!req.admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Admin authentication required.'
      });
    }

    // Check if admin has superadmin role
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Super admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Super admin auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during authorization.'
    });
  }
};

// @desc    Permission-based authorization middleware
// @access  Private/Admin
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      // First check if user is authenticated as admin
      if (!req.admin) {
        return res.status(401).json({
          status: 'error',
          message: 'Access denied. Admin authentication required.'
        });
      }

      // Check if admin has the required permission
      if (!req.admin.permissions || !req.admin.permissions[permission]) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. ${permission} permission required.`
        });
      }

      next();
    } catch (error) {
      console.error('Permission auth middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Server error during permission check.'
      });
    }
  };
};
