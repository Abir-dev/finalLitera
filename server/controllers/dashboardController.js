import User from "../models/User.js";
import Course from "../models/Course.js";
import Exam from "../models/Exam.js";
import Enrollment from "../models/Enrollment.js";
import Admin from "../models/Admin.js";

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's enrolled courses with progress
    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title thumbnail description instructor')
      .sort({ enrolledAt: -1 });

    // Get user's recent activities
    const recentActivities = await Enrollment.find({ user: userId })
      .populate('course', 'title')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      data: {
        enrollments,
        recentActivities,
        totalCourses: enrollments.length,
        completedCourses: enrollments.filter(e => e.progress >= 95).length
      }
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user dashboard data"
    });
  }
};

// @desc    Get user's course progress
// @route   GET /api/dashboard/courses/:courseId/progress
// @access  Private
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      course: courseId 
    }).populate('course', 'title modules');

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Course enrollment not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { enrollment }
    });
  } catch (error) {
    console.error("Course progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch course progress"
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/dashboard/courses/:courseId/progress
// @access  Private
export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { progress, completedVideos, lastAccessed } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { 
        progress, 
        completedVideos, 
        lastAccessed: lastAccessed || new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Course enrollment not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { enrollment }
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update course progress"
    });
  }
};

// @desc    Get admin dashboard data (legacy endpoint)
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    // Use the new dashboard stats function
    const statsResult = await getDashboardStats(req, res);
    return statsResult;
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin dashboard data"
    });
  }
};

// @desc    Get instructor dashboard data
// @route   GET /api/dashboard/instructor
// @access  Private/Instructor
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructorId })
      .select('title thumbnail description enrollmentCount rating')
      .sort({ createdAt: -1 });

    // Get total students across all courses
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courses.map(c => c._id) }
    });

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find({
      course: { $in: courses.map(c => c._id) }
    })
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .limit(10);

    res.status(200).json({
      status: "success",
      data: {
        courses,
        totalStudents,
        recentEnrollments,
        totalCourses: courses.length
      }
    });
  } catch (error) {
    console.error("Instructor dashboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch instructor dashboard data"
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const [
      totalStudents,
      totalCourses,
      totalExams,
      totalInstructors,
      activeUsers,
      totalEnrollments
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ isPublished: true }),
      Exam.countDocuments(),
      User.countDocuments({ role: "instructor" }),
      User.countDocuments({ role: "student", isActive: true }),
      Enrollment.countDocuments()
    ]);

    // Get new enrollments this week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newEnrollments = await Enrollment.countDocuments({
      enrolledAt: { $gte: oneWeekAgo }
    });

    // Calculate completion rate
    const completedEnrollments = await Enrollment.countDocuments({
      progress: { $gte: 95 }
    });
    const completionRate = totalEnrollments > 0 
      ? Math.round((completedEnrollments / totalEnrollments) * 100) 
      : 0;

    // Calculate revenue (mock calculation - replace with actual payment data)
    const revenue = totalEnrollments * 2999; // Assuming ₹2999 per enrollment

    const stats = {
      totalStudents,
      totalCourses,
      totalExams,
      totalInstructors,
      activeUsers,
      newEnrollments,
      completionRate,
      revenue,
      totalEnrollments
    };

    res.status(200).json({
      status: "success",
      data: { stats }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard statistics"
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/admin/activities
// @access  Private/Admin
export const getRecentActivities = async (req, res) => {
  try {
    const activities = [];

    // Get recent student registrations
    const recentStudents = await User.find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email createdAt");

    recentStudents.forEach(student => {
      activities.push({
        id: `student-${student._id}`,
        type: "student",
        action: "New student registered",
        details: `${student.firstName} ${student.lastName} joined the platform`,
        icon: "👤",
        timestamp: student.createdAt
      });
    });

    // Get recent course publications
    const recentCourses = await Course.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title createdAt");

    recentCourses.forEach(course => {
      activities.push({
        id: `course-${course._id}`,
        type: "course",
        action: "Course published",
        details: `${course.title} is now available`,
        icon: "📚",
        timestamp: course.createdAt
      });
    });

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate("user", "firstName lastName")
      .populate("course", "title")
      .sort({ enrolledAt: -1 })
      .limit(5);

    recentEnrollments.forEach(enrollment => {
      activities.push({
        id: `enrollment-${enrollment._id}`,
        type: "enrollment",
        action: "Course enrollment",
        details: `${enrollment.user.firstName} ${enrollment.user.lastName} enrolled in ${enrollment.course.title}`,
        icon: "🎓",
        timestamp: enrollment.enrolledAt
      });
    });

    // Sort activities by timestamp and limit to 10
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.status(200).json({
      status: "success",
      data: { activities: sortedActivities }
    });

  } catch (error) {
    console.error("Recent activities error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recent activities"
    });
  }
};

// @desc    Get top performing courses
// @route   GET /api/admin/dashboard/courses
// @access  Private/Admin
export const getTopCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments"
        }
      },
      {
        $addFields: {
          studentCount: { $size: "$enrollments" },
          revenue: { $multiply: [{ $size: "$enrollments" }, 2999] }
        }
      },
      {
        $project: {
          title: 1,
          studentCount: 1,
          revenue: 1,
          rating: { 
            $ifNull: [
              { $ifNull: ["$rating.average", "$rating"] }, 
              4.5
            ] 
          }
        }
      },
      {
        $sort: { studentCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const formattedCourses = courses.map(course => ({
      id: course._id,
      name: course.title,
      students: course.studentCount,
      rating: course.rating,
      revenue: course.revenue
    }));

    res.status(200).json({
      status: "success",
      data: { courses: formattedCourses }
    });

  } catch (error) {
    console.error("Top courses error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch top courses"
    });
  }
};

// @desc    Get enrollment trends
// @route   GET /api/admin/dashboard/trends
// @access  Private/Admin
export const getEnrollmentTrends = async (req, res) => {
  try {
    const trends = [];
    const days = 7;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [enrollments, completions] = await Promise.all([
        Enrollment.countDocuments({
          enrolledAt: { $gte: date, $lt: nextDate }
        }),
        Enrollment.countDocuments({
          completedAt: { $gte: date, $lt: nextDate }
        })
      ]);

      trends.push({
        date: date.toISOString().split('T')[0],
        enrollments,
        completions,
        revenue: enrollments * 2999
      });
    }

    res.status(200).json({
      status: "success",
      data: { trends }
    });

  } catch (error) {
    console.error("Enrollment trends error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch enrollment trends"
    });
  }
};

// @desc    Get revenue data
// @route   GET /api/admin/dashboard/revenue
// @access  Private/Admin
export const getRevenueData = async (req, res) => {
  try {
    const revenue = [];
    const months = 12;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);

      const enrollments = await Enrollment.countDocuments({
        enrolledAt: { $gte: date, $lt: nextDate }
      });

      revenue.push({
        month: date.toLocaleString('default', { month: 'short' }),
        amount: enrollments * 2999
      });
    }

    res.status(200).json({
      status: "success",
      data: { revenue }
    });

  } catch (error) {
    console.error("Revenue data error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch revenue data"
    });
  }
};

// @desc    Get student progress data
// @route   GET /api/admin/dashboard/progress
// @access  Private/Admin
export const getStudentProgress = async (req, res) => {
  try {
    const progress = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments"
        }
      },
      {
        $addFields: {
          enrolled: { $size: "$enrollments" },
          completed: {
            $size: {
              $filter: {
                input: "$enrollments",
                cond: { $gte: ["$$this.progress", 95] }
              }
            }
          },
          inProgress: {
            $size: {
              $filter: {
                input: "$enrollments",
                cond: { 
                  $and: [
                    { $gt: ["$$this.progress", 0] },
                    { $lt: ["$$this.progress", 95] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          course: "$title",
          enrolled: 1,
          completed: 1,
          inProgress: 1
        }
      },
      {
        $sort: { enrolled: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      status: "success",
      data: { progress }
    });

  } catch (error) {
    console.error("Student progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch student progress"
    });
  }
};

// @desc    Get system health
// @route   GET /api/admin/dashboard/health
// @access  Private/Admin
export const getSystemHealth = async (req, res) => {
  try {
    const health = {
      serverStatus: "online",
      databaseStatus: "connected",
      lastUpdate: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      version: process.version
    };

    res.status(200).json({
      status: "success",
      data: { health }
    });

  } catch (error) {
    console.error("System health error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch system health"
    });
  }
};