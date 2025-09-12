import express from 'express';
import { 
  getUserDashboard,
  getCourseProgress,
  updateCourseProgress,
  getAdminDashboard,
  getInstructorDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, getUserDashboard);

// @desc    Get user's course progress
// @route   GET /api/dashboard/courses/:courseId/progress
// @access  Private
router.get('/courses/:courseId/progress', protect, getCourseProgress);

// @desc    Update course progress
// @route   PUT /api/dashboard/courses/:courseId/progress
// @access  Private
router.put('/courses/:courseId/progress', protect, updateCourseProgress);

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

// @desc    Get instructor dashboard data
// @route   GET /api/dashboard/instructor
// @access  Private/Instructor
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorDashboard);

export default router;