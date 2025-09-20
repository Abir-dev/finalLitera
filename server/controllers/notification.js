import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    // Filter by read status if provided
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === "true";
    }

    // Filter by type if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const notifications = await Notification.find(filter)
      .populate("data.courseId", "title thumbnail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      status: "success",
      data: {
        notifications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          unreadCount,
        },
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch notifications",
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { notification },
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to mark notification as read",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      status: "success",
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to mark all notifications as read",
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete notification",
    });
  }
};

// @desc    Get notification count
// @route   GET /api/notifications/count
// @access  Private
export const getNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      status: "success",
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Get notification count error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get notification count",
    });
  }
};

// @desc    Create notification (Internal function)
// @access  Private
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    // Populate course data if courseId exists
    if (notificationData.data?.courseId) {
      await notification.populate("data.courseId", "title thumbnail");
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
};

// @desc    Create course announcement notification for all users with notification preferences
// @access  Private
export const createCourseAnnouncement = async (
  courseId,
  courseTitle,
  adminName
) => {
  try {
    // Get all active users who have courseUpdates notifications enabled
    const users = await User.find(
      {
        isActive: true,
        "preferences.notifications.courseUpdates": true,
      },
      "_id preferences.notifications"
    );

    console.log(
      `Found ${users.length} users eligible for course notifications`
    );

    if (users.length === 0) {
      console.log("No users found with course update notifications enabled");
      return 0;
    }

    const notifications = users.map((user) => ({
      user: user._id,
      type: "new_course_available",
      title: "New Course Available!",
      message: `A new course "${courseTitle}" has been added by ${adminName}. Check it out now!`,
      data: {
        courseId: courseId,
        adminName: adminName,
      },
      priority: "high",
      actionUrl: `/courses/${courseId}`,
      actionText: "View Course",
    }));

    // Insert all notifications
    const createdNotifications = await Notification.insertMany(notifications);

    console.log(
      `Created ${createdNotifications.length} course announcement notifications`
    );

    return createdNotifications.length;
  } catch (error) {
    console.error("Create course announcement error:", error);
    throw error;
  }
};

// @desc    Send notification to users (Admin function)
// @route   POST /api/admin/notifications/send
// @access  Private (Admin only)
export const sendNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetAudience,
      courseId,
      actionUrl,
      actionText,
      adminName,
    } = req.body;

    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({
        status: "error",
        message: "Title, message, and type are required",
      });
    }

    let targetUsers = [];

    // Determine target users based on audience and notification preferences
    switch (targetAudience) {
      case "all":
        // Get all active users who have push notifications enabled
        targetUsers = await User.find(
          {
            isActive: true,
            "preferences.notifications.push": true,
          },
          "_id"
        );
        break;
      case "enrolled":
        // Get users who are enrolled in any course and have course update notifications enabled
        const enrollments = await Enrollment.find({}, "user").populate({
          path: "user",
          match: {
            isActive: true,
            "preferences.notifications.courseUpdates": true,
          },
          select: "_id",
        });
        targetUsers = enrollments
          .map((enrollment) => enrollment.user)
          .filter(Boolean);
        break;
      case "specific":
        if (!courseId) {
          return res.status(400).json({
            status: "error",
            message: "Course ID is required for specific course notifications",
          });
        }
        // Get users enrolled in specific course who have course update notifications enabled
        const courseEnrollments = await Enrollment.find(
          { course: courseId },
          "user"
        ).populate({
          path: "user",
          match: {
            isActive: true,
            "preferences.notifications.courseUpdates": true,
          },
          select: "_id",
        });
        targetUsers = courseEnrollments
          .map((enrollment) => enrollment.user)
          .filter(Boolean);
        break;
      default:
        return res.status(400).json({
          status: "error",
          message: "Invalid target audience",
        });
    }

    if (targetUsers.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No users found for the specified target audience",
      });
    }

    // Create notifications for all target users
    const notifications = targetUsers.map((user) => ({
      user: user._id,
      type: type,
      title: title,
      message: message,
      data: {
        courseId: courseId || null,
        adminName: adminName || "Admin",
      },
      priority: priority || "medium",
      actionUrl: actionUrl || null,
      actionText: actionText || "View Details",
    }));

    // Insert all notifications
    await Notification.insertMany(notifications);

    // Emit real-time notifications to connected users
    const io = req.app.get("io");
    if (io) {
      notifications.forEach((notification) => {
        // Send to specific user
        io.to(`user_${notification.user}`).emit("new_notification", {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          timestamp: notification.createdAt,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification sent successfully",
      data: {
        recipientsCount: notifications.length,
        notificationType: type,
        targetAudience: targetAudience,
      },
    });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send notification",
    });
  }
};

// @desc    Send server maintenance notification to all students
// @route   POST /api/admin/notifications/maintenance
// @access  Private (Admin only)
export const sendMaintenanceNotice = async (req, res) => {
  try {
    const { hours = 0, minutes = 0 } = req.body || {};
    const durationMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);

    if (durationMinutes <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid maintenance duration",
      });
    }

    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + durationMinutes * 60000);

    // All students (users with role === 'student')
    const users = await User.find({ role: "student" }, "_id");
    if (!users || users.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No students found to notify",
      });
    }

    const title = "Scheduled Server Maintenance";
    const message = `The server will undergo maintenance starting now for approximately ${hours}h ${minutes}m. Expected restore by ${endAt.toLocaleString()}.`;

    const notifications = users.map((u) => ({
      user: u._id,
      type: "maintenance_notice",
      title,
      message,
      data: {
        startAt,
        endAt,
        durationMinutes,
      },
      priority: "urgent",
      actionUrl: `/dashboard/notifications`,
      actionText: "View Details",
    }));

    const created = await Notification.insertMany(notifications);

    const io = req.app.get && req.app.get("io");
    if (io) {
      created.forEach((n) => {
        io.to(`user_${n.user}`).emit("new_notification", {
          id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          data: n.data,
          priority: n.priority,
          actionUrl: n.actionUrl,
          actionText: n.actionText,
          timestamp: n.createdAt,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: "Maintenance notification sent",
      data: { recipientsCount: created.length, startAt, endAt },
    });
  } catch (error) {
    console.error("Maintenance notice error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to send maintenance notice" });
  }
};

// @desc    Send automatic notifications when a course is published
// @route   POST /api/admin/notifications/course-published
// @access  Private (Admin only)
export const sendCoursePublishedNotification = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        status: "error",
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId).populate(
      "instructor",
      "firstName lastName"
    );

    if (!course || !course.isPublished) {
      return res.status(404).json({
        status: "error",
        message: "Course not found or not published",
      });
    }

    // Get all active users who have courseUpdates notifications enabled
    const users = await User.find(
      {
        isActive: true,
        "preferences.notifications.courseUpdates": true,
      },
      "_id preferences.notifications"
    );

    console.log(
      `Sending course published notifications to ${users.length} users`
    );

    if (users.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No users found with course update notifications enabled",
        data: { recipientsCount: 0 },
      });
    }

    const instructorName = course.instructor
      ? `${course.instructor.firstName} ${course.instructor.lastName}`
      : "Admin";

    const notifications = users.map((user) => ({
      user: user._id,
      type: "new_course_available",
      title: "New Course Published!",
      message: `"${course.title}" by ${instructorName} is now available. Start learning today!`,
      data: {
        courseId: course._id,
        instructorName: instructorName,
      },
      priority: "high",
      actionUrl: `/courses/${course._id}`,
      actionText: "View Course",
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    const io = req.app.get("io");
    if (io) {
      createdNotifications.forEach((notification) => {
        io.to(`user_${notification.user}`).emit("new_notification", {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          timestamp: notification.createdAt,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course published notifications sent successfully",
      data: { recipientsCount: createdNotifications.length },
    });
  } catch (error) {
    console.error("Error sending course published notification:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send course published notification",
    });
  }
};

// @desc    Send notification when course content is updated
// @route   POST /api/admin/notifications/course-update
// @access  Private (Admin only)
export const sendCourseUpdateNotification = async (req, res) => {
  try {
    const { courseId, updateMessage } = req.body;

    if (!courseId) {
      return res.status(400).json({
        status: "error",
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Find users enrolled in this specific course who have courseUpdates notifications enabled
    const enrolledUsers = await User.find(
      {
        "enrolledCourses.course": courseId,
        isActive: true,
        "preferences.notifications.courseUpdates": true,
      },
      "_id preferences.notifications"
    );

    console.log(
      `Sending course update notifications to ${enrolledUsers.length} enrolled users`
    );

    if (enrolledUsers.length === 0) {
      return res.status(200).json({
        status: "success",
        message:
          "No enrolled users found with course update notifications enabled",
        data: { recipientsCount: 0 },
      });
    }

    const notifications = enrolledUsers.map((user) => ({
      user: user._id,
      type: "new_lesson",
      title: `Course Update: ${course.title}`,
      message:
        updateMessage ||
        `New content has been added to "${course.title}". Check it out!`,
      data: {
        courseId: courseId,
      },
      priority: "medium",
      actionUrl: `/courses/${courseId}`,
      actionText: "View Course",
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    const io = req.app.get("io");
    if (io) {
      createdNotifications.forEach((notification) => {
        io.to(`user_${notification.user}`).emit("new_notification", {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          timestamp: notification.createdAt,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course update notifications sent successfully",
      data: { recipientsCount: createdNotifications.length },
    });
  } catch (error) {
    console.error("Error sending course update notification:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send course update notification",
    });
  }
};

// @desc    Clean up expired notifications
// @route   POST /api/admin/notifications/cleanup
// @access  Private (Admin only)
export const cleanupExpiredNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log(`Cleaned up ${result.deletedCount} expired notifications`);

    res.status(200).json({
      status: "success",
      message: "Expired notifications cleaned up successfully",
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Error cleaning up expired notifications:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to clean up expired notifications",
    });
  }
};

// @desc    Get notification statistics
// @route   GET /api/admin/notifications/stats
// @access  Private (Admin only)
export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({
      isRead: false,
    });
    const notificationsByType = await Notification.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        total: totalNotifications,
        unread: unreadNotifications,
        byType: notificationsByType,
      },
    });
  } catch (error) {
    console.error("Error getting notification stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get notification statistics",
    });
  }
};

// @desc    Send notifications to users who haven't been active recently
// @route   POST /api/admin/notifications/inactivity-reminder
// @access  Private (Admin only)
export const sendInactivityReminder = async (req, res) => {
  try {
    const { days = 7 } = req.body;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Find users who haven't been active and have push notifications enabled
    const inactiveUsers = await User.find(
      {
        isActive: true,
        "preferences.notifications.push": true,
        $or: [
          { updatedAt: { $lt: cutoffDate } },
          { "enrolledCourses.progress.lastAccessed": { $lt: cutoffDate } },
        ],
      },
      "_id preferences.notifications"
    );

    console.log(
      `Sending inactivity reminders to ${inactiveUsers.length} users`
    );

    if (inactiveUsers.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No inactive users found",
        data: { recipientsCount: 0 },
      });
    }

    const notifications = inactiveUsers.map((user) => ({
      user: user._id,
      type: "system_announcement",
      title: "We miss you!",
      message: `You haven't been active for a while. Continue your learning journey with our latest courses!`,
      data: {},
      priority: "low",
      actionUrl: "/courses",
      actionText: "Browse Courses",
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    const io = req.app.get("io");
    if (io) {
      createdNotifications.forEach((notification) => {
        io.to(`user_${notification.user}`).emit("new_notification", {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          timestamp: notification.createdAt,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: "Inactivity reminders sent successfully",
      data: { recipientsCount: createdNotifications.length },
    });
  } catch (error) {
    console.error("Error sending inactivity reminders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send inactivity reminders",
    });
  }
};
