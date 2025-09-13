import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCourses,
  getUserEnrollments,
  getUserStats,
  updateProfile,
  getProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  validatePagination,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();

// @desc    Test endpoint
// @route   GET /api/users/test
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User routes are working",
    timestamp: new Date().toISOString(),
  });
});

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Private
router.get("/profile/me", protect, getProfile);

// @desc    Update current user profile
// @route   PUT /api/users/profile/me
// @access  Private
router.put("/profile/me", protect, validateProfileUpdate, updateProfile);

// @desc    Change user password
// @route   PUT /api/users/profile/change-password
// @access  Private
router.put("/profile/change-password", protect, changePassword);

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
router.get("/stats/overview", protect, authorize("admin"), getUserStats);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, authorize("admin"), validatePagination, getUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get("/:id", protect, getUserById);

// @desc    Update user (Admin only or own profile)
// @route   PUT /api/users/:id
// @access  Private
router.put("/:id", protect, validateProfileUpdate, updateUser);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), deleteUser);

// @desc    Get user's enrolled courses
// @route   GET /api/users/:id/courses
// @access  Private
router.get("/:id/courses", protect, getUserCourses);

// @desc    Get current user's enrollments from Enrollment collection
// @route   GET /api/users/enrollments
// @access  Private
router.get("/enrollments", protect, getUserEnrollments);

// @desc    Sync user enrollments from User model to Enrollment collection
// @route   POST /api/users/sync-enrollments
// @access  Private
router.post("/sync-enrollments", protect, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const Enrollment = (await import("../models/Enrollment.js")).default;

    const user = await User.findById(req.user.id).populate(
      "enrolledCourses.course"
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    for (const userEnrollment of user.enrolledCourses) {
      if (!userEnrollment.course) {
        skippedCount++;
        continue;
      }

      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        user: user._id,
        course: userEnrollment.course._id,
      });

      if (existingEnrollment) {
        skippedCount++;
        continue;
      }

      // Create new enrollment
      const enrollment = new Enrollment({
        user: user._id,
        course: userEnrollment.course._id,
        enrolledAt: userEnrollment.enrolledAt || new Date(),
        progress: userEnrollment.progress?.completedVideos
          ? Math.round(
              (userEnrollment.progress.completedVideos /
                userEnrollment.progress.totalVideos) *
                100
            )
          : 0,
        lastAccessed: userEnrollment.progress?.lastAccessed || new Date(),
        status: "active",
        completedLessons: userEnrollment.completedLessons || [],
      });

      await enrollment.save();
      syncedCount++;
    }

    res.status(200).json({
      status: "success",
      message: "Enrollments synced successfully",
      data: {
        synced: syncedCount,
        skipped: skippedCount,
        total: user.enrolledCourses.length,
      },
    });
  } catch (error) {
    console.error("Sync enrollments error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during enrollment sync",
    });
  }
});

export default router;
