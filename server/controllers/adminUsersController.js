import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// @desc    List students for admin panel
// @route   GET /api/admin/students
// @access  Private/Admin (adminAuth)
export const listStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: "student" };
    if (typeof req.query.isActive !== "undefined") {
      filter.isActive = req.query.isActive === "true";
    }

    const students = await User.find(filter)
      .select("-password")
      .populate("enrolledCourses.course", "title thumbnail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        users: students,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Admin list students error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Create new student (Admin only)
// @route   POST /api/admin/students
// @access  Private/Admin (adminAuth)
export const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "First name, last name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Create new student
    const student = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "student",
      isActive: true,
    });

    await student.save();

    // Return student data without password
    const studentData = {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role,
      isActive: student.isActive,
      createdAt: student.createdAt,
    };

    res.status(201).json({
      status: "success",
      message: "Student created successfully",
      data: {
        student: studentData,
      },
    });
  } catch (error) {
    console.error("Admin create student error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error during student creation",
    });
  }
};

// @desc    Update student (Admin only)
// @route   PUT /api/admin/students/:id
// @access  Private/Admin (adminAuth)
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, isActive, phone } = req.body;

    // Find the student
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== student.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User with this email already exists",
        });
      }
    }

    // Update student fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (phone !== undefined) {
      if (!student.profile) student.profile = {};
      student.profile.phone = phone;
    }

    // Update the student
    Object.assign(student, updateData);
    await student.save();

    // Return updated student data without password
    const studentData = {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role,
      isActive: student.isActive,
      profile: student.profile,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      data: {
        student: studentData,
      },
    });
  } catch (error) {
    console.error("Admin update student error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error during student update",
    });
  }
};

// @desc    Assign course to student (Admin only)
// @route   POST /api/admin/students/:id/assign-course
// @access  Private/Admin (adminAuth)
export const assignCourseToStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    console.log("Assigning course to student:", { studentId: id, courseId });

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({
        status: "error",
        message: "Course ID is required",
      });
    }

    // Find the student
    const student = await User.findById(id);
    if (!student) {
      console.log("Student not found:", id);
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    console.log("Found student:", student.firstName, student.lastName);
    console.log("Found course:", course.title);
    console.log("Course modules:", course.modules ? course.modules.length : 0);

    // Check if student is already enrolled in this course
    const existingEnrollment = student.enrolledCourses.find(
      enrollment => enrollment.course.toString() === courseId
    );

    console.log("Student's current enrollments:", student.enrolledCourses.length);
    console.log("Looking for course ID:", courseId);
    console.log("Existing enrollment found:", !!existingEnrollment);

    if (existingEnrollment) {
      console.log("Student is already enrolled in this course");
      return res.status(400).json({
        status: "error",
        message: "Student is already enrolled in this course",
        data: {
          student: {
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email
          },
          course: {
            id: course._id,
            title: course.title
          },
          enrollmentDate: existingEnrollment.enrolledAt
        }
      });
    }

    // Add course to student's enrolled courses
    const enrollment = {
      course: courseId,
      enrolledAt: new Date(),
      progress: {
        completedVideos: 0,
        totalVideos: (course.modules && Array.isArray(course.modules)) 
          ? course.modules.reduce((total, module) => 
              total + (module.videos && Array.isArray(module.videos) ? module.videos.length : 0), 0)
          : 0,
        watchedTime: "0:00:00",
        lastAccessed: new Date()
      },
      status: "active"
    };

    student.enrolledCourses.push(enrollment);
    await student.save();

    // Populate the course data for response
    await student.populate('enrolledCourses.course', 'title description instructor thumbnail');

    res.status(200).json({
      status: "success",
      message: "Course assigned to student successfully",
      data: {
        student: {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          enrolledCourses: student.enrolledCourses
        },
        course: {
          id: course._id,
          title: course.title,
          description: course.description
        }
      },
    });
  } catch (error) {
    console.error("Admin assign course error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      status: "error",
      message: "Server error during course assignment",
      error: error.message
    });
  }
};

// @desc    Remove course from student (Admin only)
// @route   DELETE /api/admin/students/:id/courses/:courseId
// @access  Private/Admin (adminAuth)
export const removeCourseFromStudent = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    // Find the student
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Find and remove the course enrollment
    const enrollmentIndex = student.enrolledCourses.findIndex(
      enrollment => enrollment.course.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Student is not enrolled in this course",
      });
    }

    // Remove the enrollment
    const removedEnrollment = student.enrolledCourses.splice(enrollmentIndex, 1)[0];
    await student.save();

    res.status(200).json({
      status: "success",
      message: "Course removed from student successfully",
      data: {
        student: {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email
        },
        removedCourse: {
          id: removedEnrollment.course,
          enrolledAt: removedEnrollment.enrolledAt
        }
      },
    });
  } catch (error) {
    console.error("Admin remove course error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during course removal",
    });
  }
};

// @desc    Get student progress report (Admin only)
// @route   GET /api/admin/students/:id/progress
// @access  Private/Admin (adminAuth)
export const getStudentProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student
    const student = await User.findById(id)
      .select("-password")
      .populate({
        path: "enrolledCourses.course",
        select: "title description instructor thumbnail modules duration level category"
      });

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Calculate progress data
    const progressData = {
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        joinDate: student.createdAt,
        lastActive: student.updatedAt,
        status: student.isActive ? "active" : "inactive"
      },
      courses: [],
      analytics: {
        totalLearningTime: "0:00:00",
        averageSessionTime: "0 minutes",
        learningStreak: 0,
        completionRate: 0,
        lastActivity: "Never",
        weeklyProgress: []
      }
    };

    // Process enrolled courses
    if (student.enrolledCourses && student.enrolledCourses.length > 0) {
      for (const enrollment of student.enrolledCourses) {
        const course = enrollment.course;
        if (!course) continue;

        // Calculate course progress
        const totalVideos = course.modules?.reduce((total, module) => 
          total + (module.videos?.length || 0), 0) || 0;
        
        const completedVideos = enrollment.progress?.completedVideos || 0;
        const courseProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

        // Calculate time progress
        const totalDuration = course.duration || "0:00:00";
        const watchedDuration = enrollment.progress?.watchedTime || "0:00:00";

        // Process modules
        const modules = course.modules?.map(module => {
          const moduleVideos = module.videos?.length || 0;
          const moduleCompleted = Math.floor((moduleVideos * courseProgress) / 100);
          
          return {
            id: module._id,
            title: module.title,
            progress: moduleVideos > 0 ? Math.round((moduleCompleted / moduleVideos) * 100) : 0,
            videos: moduleVideos,
            completedVideos: moduleCompleted,
            duration: module.duration || "0:00:00",
            topics: module.topics || []
          };
        }) || [];

        // Mock assessments and projects (in real implementation, these would come from database)
        const assessments = [
          { title: 'Course Fundamentals Quiz', score: Math.floor(Math.random() * 40) + 60, date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completed' },
          { title: 'Mid-term Assessment', score: Math.floor(Math.random() * 30) + 70, date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completed' },
          { title: 'Final Exam', score: null, date: null, status: 'Pending' }
        ];

        const projects = [
          { title: 'Practical Project 1', status: courseProgress > 30 ? 'Completed' : 'In Progress', score: courseProgress > 30 ? Math.floor(Math.random() * 20) + 80 : null, dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() },
          { title: 'Final Project', status: courseProgress > 70 ? 'In Progress' : 'Not Started', score: null, dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() }
        ];

        progressData.courses.push({
          id: course._id,
          title: course.title,
          instructor: course.instructor?.firstName ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown Instructor',
          enrolledDate: enrollment.enrolledAt,
          progress: courseProgress,
          totalVideos,
          completedVideos,
          totalDuration,
          watchedDuration,
          modules,
          assessments,
          projects
        });
      }

      // Calculate analytics
      const totalProgress = progressData.courses.reduce((sum, course) => sum + course.progress, 0);
      const averageProgress = progressData.courses.length > 0 ? Math.round(totalProgress / progressData.courses.length) : 0;
      
      progressData.analytics = {
        totalLearningTime: watchedDuration,
        averageSessionTime: "45 minutes",
        learningStreak: Math.floor(Math.random() * 15) + 1,
        completionRate: averageProgress,
        lastActivity: "2 hours ago",
        weeklyProgress: [
          { week: 1, videos: Math.floor(Math.random() * 5) + 1, time: Math.floor(Math.random() * 60) + 30 },
          { week: 2, videos: Math.floor(Math.random() * 5) + 2, time: Math.floor(Math.random() * 60) + 45 },
          { week: 3, videos: Math.floor(Math.random() * 5) + 1, time: Math.floor(Math.random() * 60) + 35 },
          { week: 4, videos: Math.floor(Math.random() * 5) + 3, time: Math.floor(Math.random() * 60) + 55 }
        ]
      };
    }

    res.status(200).json({
      status: "success",
      data: {
        progress: progressData
      }
    });

  } catch (error) {
    console.error("Admin get student progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching student progress",
    });
  }
};

// @desc    Delete student (Admin only)
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin (adminAuth)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Admin delete student request:', {
      studentId: id,
      admin: req.admin,
      headers: req.headers
    });

    // Find the student first
    const student = await User.findById(id);
    if (!student) {
      console.log('Student not found:', id);
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Check if the user is actually a student
    if (student.role !== 'student') {
      return res.status(400).json({
        status: "error",
        message: "Can only delete students",
      });
    }

    console.log('Found student to delete:', {
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      role: student.role
    });

    // Import required models for cleanup
    const Enrollment = (await import('../models/Enrollment.js')).default;
    const Review = (await import('../models/Review.js')).default;
    const Wallet = (await import('../models/Wallet.js')).default;
    const WalletTransaction = (await import('../models/WalletTransaction.js')).default;
    const Notification = (await import('../models/Notification.js')).default;

    // Start a transaction to ensure all deletions succeed or fail together
    const session = await User.startSession();
    session.startTransaction();

    try {
      // 1. Delete all enrollments for this student
      const enrollmentResult = await Enrollment.deleteMany(
        { user: id },
        { session }
      );
      console.log('Deleted enrollments:', enrollmentResult.deletedCount);

      // 2. Delete all reviews by this student
      const reviewResult = await Review.deleteMany(
        { user: id },
        { session }
      );
      console.log('Deleted reviews:', reviewResult.deletedCount);

      // 3. Delete wallet transactions for this student
      const walletTransactionResult = await WalletTransaction.deleteMany(
        { user: id },
        { session }
      );
      console.log('Deleted wallet transactions:', walletTransactionResult.deletedCount);

      // 4. Delete the student's wallet
      const walletResult = await Wallet.deleteOne(
        { user: id },
        { session }
      );
      console.log('Deleted wallet:', walletResult.deletedCount);

      // 5. Delete all notifications for this student
      const notificationResult = await Notification.deleteMany(
        { user: id },
        { session }
      );
      console.log('Deleted notifications:', notificationResult.deletedCount);

      // 6. Update referral relationships - set referredBy to null for users referred by this student
      const referralUpdateResult = await User.updateMany(
        { referredBy: id },
        { $unset: { referredBy: 1 } },
        { session }
      );
      console.log('Updated referral relationships:', referralUpdateResult.modifiedCount);

      // 7. Finally, delete the student user
      const userResult = await User.findByIdAndDelete(id, { session });
      console.log('Deleted user:', userResult ? 'success' : 'failed');

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      console.log('Student deleted successfully:', {
        studentId: id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email,
        deletedRecords: {
          enrollments: enrollmentResult.deletedCount,
          reviews: reviewResult.deletedCount,
          walletTransactions: walletTransactionResult.deletedCount,
          wallet: walletResult.deletedCount,
          notifications: notificationResult.deletedCount,
          referralUpdates: referralUpdateResult.modifiedCount
        }
      });

      res.status(200).json({
        status: "success",
        message: "Student deleted successfully",
        data: {
          deletedStudent: {
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email
          },
          cleanupSummary: {
            enrollments: enrollmentResult.deletedCount,
            reviews: reviewResult.deletedCount,
            walletTransactions: walletTransactionResult.deletedCount,
            wallet: walletResult.deletedCount,
            notifications: notificationResult.deletedCount,
            referralUpdates: referralUpdateResult.modifiedCount
          }
        }
      });

    } catch (transactionError) {
      // If anything fails, rollback the transaction
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }

  } catch (error) {
    console.error("Admin delete student error:", error);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: "error",
        message: "Invalid student ID format",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error during student deletion",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


