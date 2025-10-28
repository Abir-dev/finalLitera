import express from "express";
import {
  getLiveClassRecordings,
  getLiveClassRecordingById,
  getStudentRecordingById,
  createLiveClassRecording,
  updateLiveClassRecording,
  deleteLiveClassRecording,
  getRecordingsByCourse,
  getRecordingStatistics,
  getStudentRecordings,
  getStudentCourseRecordings,
  getRecordingsByEnrollmentId,
  getUserEnrollments,
  debugRecording,
  checkMissingUrls,
  testStudentRecordings,
  cleanupOrphanedEnrollments,
  getEnrolledUsersForRecording,
  getEnrolledUsersForCourse,
  debugUserRecordings,
  debugCourseRecordings,
  downloadNotesPdf,
  deletePdfNotes,
} from "../controllers/liveClassRecordingController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { protect } from "../middleware/auth.js";
import upload, { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

// @desc    Get all live class recordings
// @route   GET /api/live-class-recordings
// @access  Private/Admin
router.get("/", adminAuth, getLiveClassRecordings);

// @desc    Test endpoint for student recordings
// @route   GET /api/live-class-recordings/test-student
// @access  Private
router.get("/test-student", protect, testStudentRecordings);

// @desc    Debug endpoint for user recordings
// @route   GET /api/live-class-recordings/debug-user-recordings
// @access  Private
router.get("/debug-user-recordings", protect, debugUserRecordings);

// @desc    Debug endpoint for course recordings
// @route   GET /api/live-class-recordings/debug-course-recordings/:courseId
// @access  Private
router.get(
  "/debug-course-recordings/:courseId",
  protect,
  debugCourseRecordings
);

// @desc    Get user's enrollments with enrollment IDs
// @route   GET /api/live-class-recordings/student/enrollments
// @access  Private
router.get("/student/enrollments", protect, getUserEnrollments);

// @desc    Get recording by ID for students
// @route   GET /api/live-class-recordings/student/:id
// @access  Private
router.get("/student/:id", protect, getStudentRecordingById);

// @desc    Get recordings for student's enrolled courses
// @route   GET /api/live-class-recordings/student
// @access  Private
router.get("/student", protect, getStudentRecordings);

// @desc    Get recordings for a specific course by enrollment ID
// @route   GET /api/live-class-recordings/student/enrollment/:enrollmentId
// @access  Private
router.get(
  "/student/enrollment/:enrollmentId",
  protect,
  getRecordingsByEnrollmentId
);

// @desc    Get recordings for a specific course (for enrolled students)
// @route   GET /api/live-class-recordings/student/course/:courseId
// @access  Private
router.get("/student/course/:courseId", protect, getStudentCourseRecordings);

// @desc    Get recording statistics
// @route   GET /api/live-class-recordings/stats
// @access  Private/Admin
router.get("/stats", adminAuth, getRecordingStatistics);

// @desc    Debug endpoint to check recording URLs
// @route   GET /api/live-class-recordings/debug/:id
// @access  Private/Admin
router.get("/debug/:id", adminAuth, debugRecording);

// @desc    Check for recordings without URLs
// @route   GET /api/live-class-recordings/check-missing-urls
// @access  Private/Admin
router.get("/check-missing-urls", adminAuth, checkMissingUrls);

// @desc    Clean up orphaned enrollments
// @route   POST /api/live-class-recordings/cleanup-enrollments
// @access  Private/Admin
router.post("/cleanup-enrollments", adminAuth, cleanupOrphanedEnrollments);

// @desc    Get recordings by course
// @route   GET /api/live-class-recordings/course/:courseId
// @access  Private/Admin
router.get("/course/:courseId", adminAuth, getRecordingsByCourse);

// @desc    Get enrolled users for a course
// @route   GET /api/live-class-recordings/course/:courseId/enrolled-users
// @access  Private/Admin
router.get(
  "/course/:courseId/enrolled-users",
  adminAuth,
  getEnrolledUsersForCourse
);

// @desc    Get enrolled users for a specific recording
// @route   GET /api/live-class-recordings/:id/enrolled-users
// @access  Private/Admin
router.get("/:id/enrolled-users", adminAuth, getEnrolledUsersForRecording);

// @desc    Get live class recording by ID
// @route   GET /api/live-class-recordings/:id
// @access  Private/Admin
router.get("/:id", adminAuth, getLiveClassRecordingById);

// Timeout middleware for large file uploads
const uploadTimeout = (req, res, next) => {
  // Set timeout to 5 minutes for video uploads
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
};

// @desc    Create new live class recording
// @route   POST /api/live-class-recordings
// @access  Private/Admin
router.post(
  "/",
  adminAuth,
  uploadTimeout,
  uploadMultiple,
  createLiveClassRecording
);

// @desc    Update live class recording
// @route   PUT /api/live-class-recordings/:id
// @access  Private/Admin
router.put(
  "/:id",
  adminAuth,
  uploadTimeout,
  uploadMultiple,
  updateLiveClassRecording
);

// @desc    Download PDF notes for a recording
// @route   GET /api/live-class-recordings/:id/notes-pdf
// @access  Private (for enrolled students)
router.get("/:id/notes-pdf", protect, downloadNotesPdf);

// @desc    Delete PDF notes for a recording
// @route   DELETE /api/live-class-recordings/:id/notes-pdf
// @access  Private/Admin
router.delete("/:id/notes-pdf", adminAuth, deletePdfNotes);

// @desc    Delete live class recording
// @route   DELETE /api/live-class-recordings/:id
// @access  Private/Admin
router.delete("/:id", adminAuth, deleteLiveClassRecording);

export default router;
