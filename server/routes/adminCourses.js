import express from "express";
import path from "path";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
  getCourseStats,
  updateCourseMeetLinks,
  getAvailableCourses,
  testCourses,
} from "../controllers/adminCourseController.js";
import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { uploadMultiple, handleUploadError } from "../middleware/upload.js";

const router = express.Router();

// @desc    Get all courses (Admin view)
// @route   GET /api/admin/courses
// @access  Private/Admin
router.get(
  "/",
  adminAuth,
  requirePermission("courseManagement"),
  getAllCourses
);

// @desc    Get course statistics
// @route   GET /api/admin/courses/stats/overview
// @access  Private/Admin
router.get(
  "/stats/overview",
  adminAuth,
  requirePermission("courseManagement"),
  getCourseStats
);

// @desc    Test courses endpoint
// @route   GET /api/admin/courses/test
// @access  Private/Admin
router.get("/test", adminAuth, testCourses);

// @desc    Get available courses for assignment
// @route   GET /api/admin/courses/available
// @access  Private/Admin
router.get("/available", adminAuth, getAvailableCourses);

// @desc    Get course by ID (Admin view)
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
router.get(
  "/:id",
  adminAuth,
  requirePermission("courseManagement"),
  getCourseById
);

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private/Admin
router.post(
  "/",
  adminAuth,
  requirePermission("courseManagement"),
  uploadMultiple,
  handleUploadError,
  createCourse
);

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
router.put(
  "/:id",
  adminAuth,
  requirePermission("courseManagement"),
  uploadMultiple,
  handleUploadError,
  updateCourse
);

// @desc    Toggle course publish status
// @route   PATCH /api/admin/courses/:id/toggle-publish
// @access  Private/Admin
router.patch(
  "/:id/toggle-publish",
  adminAuth,
  requirePermission("courseManagement"),
  toggleCoursePublish
);

// @desc    Update course meet links
// @route   PUT /api/admin/courses/:id/meet-links
// @access  Private/Admin
router.put(
  "/:id/meet-links",
  adminAuth,
  requirePermission("courseManagement"),
  updateCourseMeetLinks
);

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
router.delete(
  "/:id",
  adminAuth,
  requirePermission("courseManagement"),
  deleteCourse
);

export default router;
