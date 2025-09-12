import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail instructor rating duration price',
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar'
        }
      });

    // Get recent courses (last 5)
    const recentCourses = user.enrolledCourses
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, 5);

    // Get courses in progress (progress > 0 and < 100)
    const coursesInProgress = user.enrolledCourses.filter(
      enrollment => enrollment.progress > 0 && enrollment.progress < 100
    );

    // Get completed courses (progress = 100)
    const completedCourses = user.enrolledCourses.filter(
      enrollment => enrollment.progress === 100
    );

    // Calculate statistics
    const totalEnrolled = user.enrolledCourses.length;
    const totalCompleted = completedCourses.length;
    const averageProgress = totalEnrolled > 0 
      ? Math.round(user.enrolledCourses.reduce((sum, enrollment) => sum + enrollment.progress, 0) / totalEnrolled)
      : 0;

    // Get learning streak (consecutive days with activity)
    const learningStreak = await calculateLearningStreak(user._id);

    // Get recent notifications
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role
        },
        stats: {
          totalEnrolled,
          totalCompleted,
          coursesInProgress: coursesInProgress.length,
          averageProgress,
          learningStreak
        },
        recentCourses,
        coursesInProgress,
        completedCourses,
        notifications
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get user's course progress
// @route   GET /api/dashboard/courses/:courseId/progress
// @access  Private
export const getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    if (!user.isEnrolledInCourse(req.params.courseId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are not enrolled in this course'
      });
    }

    const enrollment = user.enrolledCourses.find(
      enrollment => enrollment.course.toString() === req.params.courseId
    );

    // Get detailed progress for each module
    const moduleProgress = course.modules.map(module => {
      const totalLessons = module.lessons.length;
      const completedLessons = module.lessons.filter(lesson => 
        enrollment.completedLessons.includes(lesson._id)
      ).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        moduleId: module._id,
        title: module.title,
        totalLessons,
        completedLessons,
        progress,
        isCompleted: progress === 100
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        course: {
          id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          instructor: course.instructor
        },
        enrollment: {
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          lastAccessed: enrollment.lastAccessed
        },
        moduleProgress
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/dashboard/courses/:courseId/progress
// @access  Private
export const updateCourseProgress = async (req, res) => {
  try {
    const { progress, lessonId } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.isEnrolledInCourse(req.params.courseId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are not enrolled in this course'
      });
    }

    await user.updateCourseProgress(req.params.courseId, progress, lessonId);

    // If course is completed, increment completion count and create notification
    if (progress === 100) {
      const course = await Course.findById(req.params.courseId);
      if (course) {
        await course.incrementCompletion();
        
        // Create completion notification
        await Notification.create({
          user: req.user.id,
          type: 'course_completion',
          title: 'Course Completed! 🎉',
          message: `Congratulations! You have completed "${course.title}"`,
          data: { courseId: course._id }
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update course progress error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Get course statistics
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const featuredCourses = await Course.countDocuments({ isFeatured: true });

    // Get enrollment statistics
    const totalEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $count: 'total' }
    ]);

    // Get revenue statistics (if you have payment integration)
    const revenueStats = await getRevenueStats();

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('instructor', 'firstName lastName')
      .select('title instructor createdAt enrollmentCount');

    // Get top courses by enrollment
    const topCourses = await Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .populate('instructor', 'firstName lastName')
      .select('title instructor enrollmentCount rating');

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          users: {
            total: totalUsers,
            active: activeUsers,
            new: newUsers
          },
          courses: {
            total: totalCourses,
            published: publishedCourses,
            featured: featuredCourses
          },
          enrollments: totalEnrollments[0]?.total || 0,
          revenue: revenueStats
        },
        recentUsers,
        recentCourses,
        topCourses
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get instructor dashboard data
// @route   GET /api/dashboard/instructor
// @access  Private/Instructor
export const getInstructorDashboard = async (req, res) => {
  try {
    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    // Get course statistics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.enrollmentCount), 0);

    // Get recent enrollments
    const recentEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.course': { $in: courses.map(c => c._id) } } },
      { $sort: { 'enrolledCourses.enrolledAt': -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'courses',
        localField: 'enrolledCourses.course',
        foreignField: '_id',
        as: 'course'
      }},
      { $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        'enrolledCourses.enrolledAt': 1,
        'course.title': 1
      }}
    ]);

    // Get course performance
    const coursePerformance = courses.map(course => ({
      id: course._id,
      title: course.title,
      enrollments: course.enrollmentCount,
      rating: course.rating.average,
      revenue: course.price * course.enrollmentCount
    }));

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalCourses,
          publishedCourses,
          totalEnrollments,
          totalRevenue
        },
        courses,
        recentEnrollments,
        coursePerformance
      }
    });
  } catch (error) {
    console.error('Get instructor dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Helper function to calculate learning streak
async function calculateLearningStreak(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || user.enrolledCourses.length === 0) return 0;

    // This is a simplified calculation
    // In a real app, you'd track daily activity more precisely
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentActivity = user.enrolledCourses.filter(
      enrollment => new Date(enrollment.lastAccessed) >= thirtyDaysAgo
    );

    return Math.min(recentActivity.length, 30);
  } catch (error) {
    console.error('Calculate learning streak error:', error);
    return 0;
  }
}

// Helper function to get revenue statistics
async function getRevenueStats() {
  try {
    // This is a placeholder - implement based on your payment system
    return {
      total: 0,
      monthly: 0,
      yearly: 0
    };
  } catch (error) {
    console.error('Get revenue stats error:', error);
    return {
      total: 0,
      monthly: 0,
      yearly: 0
    };
  }
}
