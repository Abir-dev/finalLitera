import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

/**
 * Notification Service
 * Handles automatic notifications based on user preferences
 */

/**
 * Send automatic notifications when a course is published
 * @param {string} courseId - The course ID
 * @param {Object} io - Socket.io instance (optional)
 */
export const sendCoursePublishedNotification = async (courseId, io = null) => {
  try {
    const course = await Course.findById(courseId).populate('instructor', 'firstName lastName');
    
    if (!course || !course.isPublished) {
      console.log('Course not found or not published, skipping notification');
      return 0;
    }

    // Get all active users who have courseUpdates notifications enabled
    const users = await User.find({
      isActive: true,
      'preferences.notifications.courseUpdates': true
    }, '_id preferences.notifications');

    console.log(`Sending course published notifications to ${users.length} users`);

    if (users.length === 0) {
      return 0;
    }

    const instructorName = course.instructor ? 
      `${course.instructor.firstName} ${course.instructor.lastName}` : 
      'Admin';

    const notifications = users.map(user => ({
      user: user._id,
      type: 'new_course_available',
      title: 'New Course Published!',
      message: `"${course.title}" by ${instructorName} is now available. Start learning today!`,
      data: {
        courseId: course._id,
        instructorName: instructorName
      },
      priority: 'high',
      actionUrl: `/courses/${course._id}`,
      actionText: 'View Course'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    if (io) {
      createdNotifications.forEach(notification => {
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

    console.log(`Successfully sent ${createdNotifications.length} course published notifications`);
    return createdNotifications.length;
  } catch (error) {
    console.error('Error sending course published notification:', error);
    throw error;
  }
};

/**
 * Send notification when course content is updated
 * @param {string} courseId - The course ID
 * @param {string} updateMessage - Custom message about the update
 * @param {Object} io - Socket.io instance (optional)
 */
export const sendCourseUpdateNotification = async (courseId, updateMessage, io = null) => {
  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      console.log('Course not found, skipping notification');
      return 0;
    }

    // Find users enrolled in this specific course who have courseUpdates notifications enabled
    const enrolledUsers = await User.find({
      'enrolledCourses.course': courseId,
      isActive: true,
      'preferences.notifications.courseUpdates': true
    }, '_id preferences.notifications');

    console.log(`Sending course update notifications to ${enrolledUsers.length} enrolled users`);

    if (enrolledUsers.length === 0) {
      return 0;
    }

    const notifications = enrolledUsers.map(user => ({
      user: user._id,
      type: 'new_lesson',
      title: `Course Update: ${course.title}`,
      message: updateMessage || `New content has been added to "${course.title}". Check it out!`,
      data: {
        courseId: courseId
      },
      priority: 'medium',
      actionUrl: `/courses/${courseId}`,
      actionText: 'View Course'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    if (io) {
      createdNotifications.forEach(notification => {
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

    console.log(`Successfully sent ${createdNotifications.length} course update notifications`);
    return createdNotifications.length;
  } catch (error) {
    console.error('Error sending course update notification:', error);
    throw error;
  }
};

/**
 * Send system announcements to users based on their notification preferences
 * @param {string} title - Announcement title
 * @param {string} message - Announcement message
 * @param {string} priority - Notification priority (low, medium, high, urgent)
 * @param {Object} io - Socket.io instance (optional)
 */
export const sendSystemAnnouncement = async (title, message, priority = 'medium', io = null) => {
  try {
    // Get all active users who have push notifications enabled
    const users = await User.find({
      isActive: true,
      'preferences.notifications.push': true
    }, '_id preferences.notifications');

    console.log(`Sending system announcement to ${users.length} users`);

    if (users.length === 0) {
      return 0;
    }

    const notifications = users.map(user => ({
      user: user._id,
      type: 'system_announcement',
      title: title,
      message: message,
      data: {},
      priority: priority,
      actionUrl: '/dashboard',
      actionText: 'View Dashboard'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    if (io) {
      createdNotifications.forEach(notification => {
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

    console.log(`Successfully sent ${createdNotifications.length} system announcements`);
    return createdNotifications.length;
  } catch (error) {
    console.error('Error sending system announcement:', error);
    throw error;
  }
};

/**
 * Clean up expired notifications
 */
export const cleanupExpiredNotifications = async () => {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired notifications`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    throw error;
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async () => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    const notificationsByType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      total: totalNotifications,
      unread: unreadNotifications,
      byType: notificationsByType
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    throw error;
  }
};

/**
 * Send notifications to users who haven't been active recently
 * @param {number} days - Number of days of inactivity
 * @param {Object} io - Socket.io instance (optional)
 */
export const sendInactivityReminder = async (days = 7, io = null) => {
  try {
    const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
    // Find users who haven't been active and have push notifications enabled
    const inactiveUsers = await User.find({
      isActive: true,
      'preferences.notifications.push': true,
      $or: [
        { updatedAt: { $lt: cutoffDate } },
        { 'enrolledCourses.progress.lastAccessed': { $lt: cutoffDate } }
      ]
    }, '_id preferences.notifications');

    console.log(`Sending inactivity reminders to ${inactiveUsers.length} users`);

    if (inactiveUsers.length === 0) {
      return 0;
    }

    const notifications = inactiveUsers.map(user => ({
      user: user._id,
      type: 'system_announcement',
      title: 'We miss you!',
      message: `You haven't been active for a while. Continue your learning journey with our latest courses!`,
      data: {},
      priority: 'low',
      actionUrl: '/courses',
      actionText: 'Browse Courses'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications if socket.io is available
    if (io) {
      createdNotifications.forEach(notification => {
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

    console.log(`Successfully sent ${createdNotifications.length} inactivity reminders`);
    return createdNotifications.length;
  } catch (error) {
    console.error('Error sending inactivity reminders:', error);
    throw error;
  }
};

export default {
  sendCoursePublishedNotification,
  sendCourseUpdateNotification,
  sendSystemAnnouncement,
  cleanupExpiredNotifications,
  getNotificationStats,
  sendInactivityReminder
};
