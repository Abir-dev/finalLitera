import express from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { 
  sendMaintenanceNotice, 
  sendNotification 
} from "../controllers/notification.js";
import { 
  sendSystemAnnouncement,
  getNotificationStats 
} from "../services/notificationService.js";
import {
  adminAuth,
  superAdminAuth,
  requirePermission,
} from "../middleware/adminAuth.js";
import {
  listStudents,
  createStudent,
  updateStudent,
  assignCourseToStudent,
  removeCourseFromStudent,
  getStudentProgress,
} from "../controllers/adminUsersController.js";
import {
  getDashboardStats,
  getRecentActivities,
  getTopCourses,
  getEnrollmentTrends,
  getRevenueData,
  getStudentProgress as getDashboardProgress,
  getSystemHealth,
} from "../controllers/dashboardController.js";

const router = express.Router();

// @desc    Admin authentication routes
// @route   POST /api/admin/login
// @access  Public
router.post("/login", adminLogin);

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
router.get("/profile", adminAuth, getAdminProfile);

// @desc    Notification management routes
// @route   POST /api/admin/notifications/send
// @access  Private/Admin
router.post(
  "/notifications/send",
  adminAuth,
  requirePermission("notifications"),
  sendNotification
);

// @route   POST /api/admin/notifications/maintenance
// @access  Private/Admin
router.post(
  "/notifications/maintenance",
  adminAuth,
  requirePermission("notifications"),
  sendMaintenanceNotice
);

// @route   POST /api/admin/notifications/announcement
// @access  Private/Admin
router.post(
  "/notifications/announcement",
  adminAuth,
  requirePermission("notifications"),
  async (req, res) => {
    try {
      const { title, message, priority } = req.body;
      
      if (!title || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'Title and message are required'
        });
      }
      
      // Get socket.io instance if available
      const io = req.app.get('io');
      
      const count = await sendSystemAnnouncement(title, message, priority, io);
      
      res.status(200).json({
        status: 'success',
        message: 'System announcement sent successfully',
        data: {
          recipientsCount: count
        }
      });
    } catch (error) {
      console.error('Send system announcement error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send system announcement'
      });
    }
  }
);

// @route   GET /api/admin/notifications/stats
// @access  Private/Admin
router.get(
  "/notifications/stats",
  adminAuth,
  requirePermission("notifications"),
  async (req, res) => {
    try {
      const stats = await getNotificationStats();
      
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Get notification stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get notification statistics'
      });
    }
  }
);

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
router.put("/profile", adminAuth, updateAdminProfile);

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private/Admin
router.put("/change-password", adminAuth, changeAdminPassword);

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin/admins
// @access  Private/SuperAdmin
router.get("/admins", adminAuth, superAdminAuth, getAllAdmins);

// @desc    Create new admin (Super Admin only)
// @route   POST /api/admin/admins
// @access  Private/SuperAdmin
router.post("/admins", adminAuth, superAdminAuth, createAdmin);

// @desc    Update admin (Super Admin only)
// @route   PUT /api/admin/admins/:id
// @access  Private/SuperAdmin
router.put("/admins/:id", adminAuth, superAdminAuth, updateAdmin);

// @desc    Delete admin (Super Admin only)
// @route   DELETE /api/admin/admins/:id
// @access  Private/SuperAdmin
router.delete("/admins/:id", adminAuth, superAdminAuth, deleteAdmin);

// @desc    Verify admin token
// @route   GET /api/admin/verify
// @access  Private/Admin
router.get("/verify", adminAuth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin token is valid",
    data: {
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        role: req.admin.role,
        permissions: req.admin.permissions,
      },
    },
  });
});

// @desc    Get all students (Admin)
// @route   GET /api/admin/students
// @access  Private/Admin
router.get("/students", adminAuth, listStudents);

// @desc    Create new student (Admin)
// @route   POST /api/admin/students
// @access  Private/Admin
router.post("/students", adminAuth, createStudent);

// @desc    Update student (Admin)
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
router.put("/students/:id", adminAuth, updateStudent);

// @desc    Assign course to student (Admin)
// @route   POST /api/admin/students/:id/assign-course
// @access  Private/Admin
router.post("/students/:id/assign-course", adminAuth, assignCourseToStudent);

// @desc    Remove course from student (Admin)
// @route   DELETE /api/admin/students/:id/courses/:courseId
// @access  Private/Admin
router.delete("/students/:id/courses/:courseId", adminAuth, removeCourseFromStudent);

// @desc    Get student progress report (Admin)
// @route   GET /api/admin/students/:id/progress
// @access  Private/Admin
router.get("/students/:id/progress", adminAuth, getStudentProgress);

// @desc    Dashboard routes
// @route   GET /api/admin/dashboard/*
// @access  Private/Admin
router.get("/dashboard/stats", adminAuth, getDashboardStats);
router.get("/dashboard/activities", adminAuth, getRecentActivities);
router.get("/dashboard/courses", adminAuth, getTopCourses);
router.get("/dashboard/trends", adminAuth, getEnrollmentTrends);
router.get("/dashboard/revenue", adminAuth, getRevenueData);
router.get("/dashboard/progress", adminAuth, getDashboardProgress);
router.get("/dashboard/health", adminAuth, getSystemHealth);

export default router;
