import express from "express";
import {
  getLiveClasses,
  getCurrentlyLiveClasses,
  getUpcomingLiveClasses,
  getLiveClassById,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  enrollInLiveClass,
  markAttendance,
  addChatMessage,
  rateLiveClass,
  getLiveClassesByInstructor,
  updateLiveClassStatus,
} from "../controllers/liveClassController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// @desc    Get all live classes
// @route   GET /api/live-classes
// @access  Public
router.get("/", getLiveClasses);

// @desc    Get currently live classes
// @route   GET /api/live-classes/live
// @access  Public
router.get("/live", getCurrentlyLiveClasses);

// @desc    Get upcoming live classes
// @route   GET /api/live-classes/upcoming
// @access  Public
router.get("/upcoming", getUpcomingLiveClasses);

// @desc    Get live classes by instructor
// @route   GET /api/live-classes/instructor/:instructorId
// @access  Private/Admin
router.get("/instructor/:instructorId", adminAuth, getLiveClassesByInstructor);

// @desc    Get live class by ID
// @route   GET /api/live-classes/:id
// @access  Public
router.get("/:id", optionalAuth, getLiveClassById);

// @desc    Create new live class
// @route   POST /api/live-classes
// @access  Private/Instructor/Admin
router.post("/", protect, authorize("instructor", "admin"), createLiveClass);

// @desc    Update live class
// @route   PUT /api/live-classes/:id
// @access  Private/Instructor/Admin
router.put("/:id", protect, authorize("instructor", "admin"), updateLiveClass);

// @desc    Delete live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Instructor/Admin
router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  deleteLiveClass
);

// @desc    Enroll in live class
// @route   POST /api/live-classes/:id/enroll
// @access  Private
router.post("/:id/enroll", protect, enrollInLiveClass);

// @desc    Mark attendance for live class
// @route   POST /api/live-classes/:id/attendance
// @access  Private/Instructor/Admin
router.post(
  "/:id/attendance",
  protect,
  authorize("instructor", "admin"),
  markAttendance
);

// @desc    Add chat message to live class
// @route   POST /api/live-classes/:id/chat
// @access  Private
router.post("/:id/chat", protect, addChatMessage);

// @desc    Rate live class
// @route   POST /api/live-classes/:id/rate
// @access  Private
router.post("/:id/rate", protect, rateLiveClass);

// @desc    Update live class status
// @route   PUT /api/live-classes/:id/status
// @access  Private/Instructor/Admin
router.put(
  "/:id/status",
  protect,
  authorize("instructor", "admin"),
  updateLiveClassStatus
);

export default router;
