import express from 'express';
import { 
  getCourses,
  getFeaturedCourses,
  getLaunchPadCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  addCourseReview,
  getCourseCategories,
  getCoursesByInstructor
} from '../controllers/courseController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { 
  validateCourseCreation, 
  validateCourseUpdate, 
  validateReview,
  validateObjectId,
  validatePagination,
  validateSearch
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', getCourses);

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
router.get('/featured', getFeaturedCourses);

// @desc    Get course categories
// @route   GET /api/courses/categories/list
// @access  Public
router.get('/categories/list', getCourseCategories);

// @desc    Get LaunchPad courses
// @route   GET /api/courses/launchpad
// @access  Public
router.get('/launchpad', getLaunchPadCourses);

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor/:instructorId
// @access  Private/Admin
router.get('/instructor/:instructorId', protect, authorize('admin'), validateObjectId('instructorId'), getCoursesByInstructor);

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', getCourseById);

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Instructor
router.post('/',  createCourse);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin
router.put('/:id',  updateCourse);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
router.delete('/:id',  deleteCourse);

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll',  enrollInCourse);

// @desc    Add course review
// @route   POST /api/courses/:id/reviews
// @access  Private
router.post('/:id/reviews',addCourseReview);

export default router;