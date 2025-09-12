import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminController.js';
import { adminAuth, superAdminAuth, requirePermission } from '../middleware/adminAuth.js';
import { listStudents } from '../controllers/adminUsersController.js';

const router = express.Router();

// @desc    Admin authentication routes
// @route   POST /api/admin/login
// @access  Public
router.post('/login', adminLogin);

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
router.get('/profile', adminAuth, getAdminProfile);

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
router.put('/profile', adminAuth, updateAdminProfile);

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private/Admin
router.put('/change-password', adminAuth, changeAdminPassword);

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin/admins
// @access  Private/SuperAdmin
router.get('/admins', adminAuth, superAdminAuth, getAllAdmins);

// @desc    Create new admin (Super Admin only)
// @route   POST /api/admin/admins
// @access  Private/SuperAdmin
router.post('/admins', adminAuth, superAdminAuth, createAdmin);

// @desc    Update admin (Super Admin only)
// @route   PUT /api/admin/admins/:id
// @access  Private/SuperAdmin
router.put('/admins/:id', adminAuth, superAdminAuth, updateAdmin);

// @desc    Delete admin (Super Admin only)
// @route   DELETE /api/admin/admins/:id
// @access  Private/SuperAdmin
router.delete('/admins/:id', adminAuth, superAdminAuth, deleteAdmin);

// @desc    Verify admin token
// @route   GET /api/admin/verify
// @access  Private/Admin
router.get('/verify', adminAuth, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin token is valid',
    data: {
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        role: req.admin.role,
        permissions: req.admin.permissions
      }
    }
  });
});

// @desc    Get all students (Admin)
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', adminAuth, listStudents);

export default router;
