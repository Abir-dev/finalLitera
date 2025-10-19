import express from "express";
import {
  getLiveClassRecordings,
  getLiveClassRecordingById,
  createLiveClassRecording,
  updateLiveClassRecording,
  deleteLiveClassRecording,
  getRecordingsByCourse,
  getRecordingStatistics,
} from "../controllers/liveClassRecordingController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// @desc    Get all live class recordings
// @route   GET /api/live-class-recordings
// @access  Private/Admin
router.get("/", adminAuth, getLiveClassRecordings);

// @desc    Get recording statistics
// @route   GET /api/live-class-recordings/stats
// @access  Private/Admin
router.get("/stats", adminAuth, getRecordingStatistics);

// @desc    Get recordings by course
// @route   GET /api/live-class-recordings/course/:courseId
// @access  Private/Admin
router.get("/course/:courseId", adminAuth, getRecordingsByCourse);

// @desc    Get live class recording by ID
// @route   GET /api/live-class-recordings/:id
// @access  Private/Admin
router.get("/:id", adminAuth, getLiveClassRecordingById);

// @desc    Create new live class recording
// @route   POST /api/live-class-recordings
// @access  Private/Admin
router.post("/", adminAuth, upload.single("video"), createLiveClassRecording);

// @desc    Update live class recording
// @route   PUT /api/live-class-recordings/:id
// @access  Private/Admin
router.put("/:id", adminAuth, updateLiveClassRecording);

// @desc    Delete live class recording
// @route   DELETE /api/live-class-recordings/:id
// @access  Private/Admin
router.delete("/:id", adminAuth, deleteLiveClassRecording);

export default router;
