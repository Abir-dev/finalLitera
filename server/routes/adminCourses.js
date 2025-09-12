import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
  getCourseStats
} from '../controllers/adminCourseController.js';
import { adminAuth, requirePermission } from '../middleware/adminAuth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// @desc    Get all courses (Admin view)
// @route   GET /api/admin/courses
// @access  Private/Admin
router.get('/', adminAuth, requirePermission('courseManagement'), getAllCourses);

// @desc    Get course statistics
// @route   GET /api/admin/courses/stats/overview
// @access  Private/Admin
router.get('/stats/overview', adminAuth, requirePermission('courseManagement'), getCourseStats);

// @desc    Get course by ID (Admin view)
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
router.get('/:id', adminAuth, requirePermission('courseManagement'), getCourseById);

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private/Admin
router.post('/', 
  adminAuth, 
  requirePermission('courseManagement'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 10 }
  ]),
  createCourse
);

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
router.put('/:id', 
  adminAuth, 
  requirePermission('courseManagement'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 10 }
  ]),
  updateCourse
);

// @desc    Toggle course publish status
// @route   PATCH /api/admin/courses/:id/toggle-publish
// @access  Private/Admin
router.patch('/:id/toggle-publish', adminAuth, requirePermission('courseManagement'), toggleCoursePublish);

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
router.delete('/:id', adminAuth, requirePermission('courseManagement'), deleteCourse);

export default router;
