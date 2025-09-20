import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get("/", getUserNotifications);

// @route   GET /api/notifications/count
// @desc    Get unread notification count
// @access  Private
router.get("/count", getNotificationCount);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark specific notification as read
// @access  Private
router.patch("/:id/read", markAsRead);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.patch("/read-all", markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete specific notification
// @access  Private
router.delete("/:id", deleteNotification);

// @route   GET /api/notifications/preferences
// @desc    Get user notification preferences
// @access  Private
router.get("/preferences", getNotificationPreferences);

// @route   PUT /api/notifications/preferences
// @desc    Update user notification preferences
// @access  Private
router.put("/preferences", updateNotificationPreferences);

export default router;
