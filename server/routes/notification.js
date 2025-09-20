import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
} from "../controllers/notification.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

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
router.get("/preferences", async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'preferences.notifications');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        preferences: user.preferences.notifications
      }
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get notification preferences'
    });
  }
});

// @route   PUT /api/notifications/preferences
// @desc    Update user notification preferences
// @access  Private
router.put("/preferences", async (req, res) => {
  try {
    const { email, push, courseUpdates, marketing } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update notification preferences
    if (email !== undefined) user.preferences.notifications.email = email;
    if (push !== undefined) user.preferences.notifications.push = push;
    if (courseUpdates !== undefined) user.preferences.notifications.courseUpdates = courseUpdates;
    if (marketing !== undefined) user.preferences.notifications.marketing = marketing;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Notification preferences updated successfully',
      data: {
        preferences: user.preferences.notifications
      }
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update notification preferences'
    });
  }
});

export default router;
