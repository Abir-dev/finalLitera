import express from 'express';
import { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCourses,
  getUserStats,
  updateProfile,
  getProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validatePagination, validateProfileUpdate } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Private
router.get('/profile/me', protect, getProfile);

// @desc    Update current user profile
// @route   PUT /api/users/profile/me
// @access  Private
router.put('/profile/me', protect, validateProfileUpdate, updateProfile);

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), getUserStats);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), validatePagination, getUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, getUserById);

// @desc    Update user (Admin only or own profile)
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, validateProfileUpdate, updateUser);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser);

// @desc    Get user's enrolled courses
// @route   GET /api/users/:id/courses
// @access  Private
router.get('/:id/courses', protect, getUserCourses);

export default router;