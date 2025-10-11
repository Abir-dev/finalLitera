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
import { adminAuth } from "../middleware/adminAuth.js";
import {
  validatePagination,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();


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

// --- Referral endpoints (MUST come before any dynamic :id routes) ---
// @desc    Get current user's referral details (code, link, stats)
// @route   GET /api/users/referral/me
// @access  Private
router.get("/referral/me", protect, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user.id).select("referralCode referral referredBy");
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    // Ensure referral code exists
    if (!user.referralCode) {
      await user.generateReferralCode();
    }

    const apiBase = process.env.CLIENT_BASE_URL || process.env.FRONTEND_URL || "https://finallitera.onrender.com";
    const invitePath = "/invite";
    const inviteLink = `${apiBase}${invitePath}?ref=${encodeURIComponent(user.referralCode)}`;

    res.status(200).json({
      status: "success",
      data: {
        referralCode: user.referralCode,
        referredBy: user.referredBy || null,
        stats: user.referral || { totalInvites: 0, successfulPurchases: 0, totalCoinsEarned: 0 },
        inviteLink,
      },
    });
  } catch (error) {
    console.error("Get referral details error:", error);
    res.status(500).json({ status: "error", message: "Failed to get referral details" });
  }
});

// @desc    Regenerate referral code (rarely needed)
// @route   POST /api/users/referral/regenerate
// @access  Private
router.post("/referral/regenerate", protect, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    
    // Clear existing referral code and generate new one
    user.referralCode = undefined;
    await user.save();
    
    // Ensure new code is generated
    if (!user.referralCode) {
      await user.generateReferralCode();
    }
    
    res.status(200).json({ 
      status: "success", 
      data: { 
        referralCode: user.referralCode,
        message: "Referral code regenerated successfully"
      } 
    });
  } catch (error) {
    console.error("Regenerate referral code error:", error);
    res.status(500).json({ status: "error", message: "Failed to regenerate referral code" });
  }
});


// @desc    Get user's referral discount status
// @route   GET /api/users/referral/discount-status
// @access  Private
router.get("/referral/discount-status", protect, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user.id).select("referralDiscountUsed referredBy referralCode");
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const eligible = !user.referralDiscountUsed;
    
    res.status(200).json({
      status: "success",
      data: {
        eligible,
        hasUsedReferralDiscount: user.referralDiscountUsed,
        referredBy: user.referredBy,
        referralCode: user.referralCode,
        message: eligible 
          ? "You are eligible for a referral discount" 
          : "You have already used a referral discount"
      }
    });
  } catch (error) {
    console.error("Get referral discount status error:", error);
    res.status(500).json({ status: "error", message: "Failed to get referral discount status" });
  }
});

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
router.get("/stats/overview", adminAuth, getUserStats);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", adminAuth, validatePagination, getUsers);

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
router.delete("/:id", deleteUser);

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
