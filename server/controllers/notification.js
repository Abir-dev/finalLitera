import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

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
      filter.isRead = req.query.isRead === 'true';
    }

    // Filter by type if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const notifications = await Notification.find(filter)
      .populate('data.courseId', 'title thumbnail')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      user: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      status: 'success',
      data: {
        notifications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          unreadCount
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch notifications'
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
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read'
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
        readAt: new Date() 
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark all notifications as read'
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
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification'
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
      isRead: false 
    });

    res.status(200).json({
      status: 'success',
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get notification count error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get notification count'
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
      await notification.populate('data.courseId', 'title thumbnail');
    }
    
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// @desc    Create course announcement notification for all users
// @access  Private
export const createCourseAnnouncement = async (courseId, courseTitle, adminName) => {
  try {
    // Get all users
    const users = await User.find({}, '_id');
    
    const notifications = users.map(user => ({
      user: user._id,
      type: 'new_course_available',
      title: 'New Course Available!',
      message: `A new course "${courseTitle}" has been added by ${adminName}. Check it out now!`,
      data: {
        courseId: courseId,
        adminName: adminName
      },
      priority: 'high',
      actionUrl: `/courses/${courseId}`,
      actionText: 'View Course'
    }));

    // Insert all notifications
    await Notification.insertMany(notifications);
    
    return notifications.length;
  } catch (error) {
    console.error('Create course announcement error:', error);
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
      adminName
    } = req.body;

    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, message, and type are required'
      });
    }

    let targetUsers = [];

    // Determine target users based on audience
    switch (targetAudience) {
      case 'all':
        targetUsers = await User.find({}, '_id');
        break;
      case 'enrolled':
        // Get users who are enrolled in any course
        const enrollments = await Enrollment.find({}, 'user').populate('user', '_id');
        targetUsers = enrollments.map(enrollment => enrollment.user).filter(Boolean);
        break;
      case 'specific':
        if (!courseId) {
          return res.status(400).json({
            status: 'error',
            message: 'Course ID is required for specific course notifications'
          });
        }
        // Get users enrolled in specific course
        const courseEnrollments = await Enrollment.find({ course: courseId }, 'user').populate('user', '_id');
        targetUsers = courseEnrollments.map(enrollment => enrollment.user).filter(Boolean);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid target audience'
        });
    }

    if (targetUsers.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No users found for the specified target audience'
      });
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(user => ({
      user: user._id,
      type: type,
      title: title,
      message: message,
      data: {
        courseId: courseId || null,
        adminName: adminName || 'Admin'
      },
      priority: priority || 'medium',
      actionUrl: actionUrl || null,
      actionText: actionText || 'View Details'
    }));

    // Insert all notifications
    await Notification.insertMany(notifications);

    // Emit real-time notifications to connected users
    const io = req.app.get('io');
    if (io) {
      notifications.forEach(notification => {
        // Send to specific user
        io.to(`user_${notification.user}`).emit('new_notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          timestamp: notification.createdAt
        });
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification sent successfully',
      data: {
        recipientsCount: notifications.length,
        notificationType: type,
        targetAudience: targetAudience
      }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification'
    });
  }
};