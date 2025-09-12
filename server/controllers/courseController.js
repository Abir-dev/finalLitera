import Course from '../models/Course.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isPublished: true };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.instructor) filter.instructor = req.query.instructor;
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Search filter
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    // Build sort object
    const sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      isPublished: true, 
      isFeatured: true 
    })
      .populate('instructor', 'firstName lastName avatar')
      .sort({ 'rating.average': -1, enrollmentCount: -1 })
      .limit(8);

    res.status(200).json({
      status: 'success',
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get LaunchPad courses
// @route   GET /api/courses/launchpad
// @access  Public
export const getLaunchPadCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      isPublished: true, 
      isLaunchPad: true 
    })
      .populate('instructor', 'firstName lastName avatar')
      .sort({ 'rating.average': -1, enrollmentCount: -1 })
      .limit(12);

    res.status(200).json({
      status: 'success',
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Get LaunchPad courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName avatar profile.bio')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    let userProgress = 0;
    
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user && user.isEnrolledInCourse(req.params.id)) {
        isEnrolled = true;
        userProgress = user.getCourseProgress(req.params.id);
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        course,
        enrollment: {
          isEnrolled,
          progress: userProgress
        }
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req, res) => {
  try {
    const body = req.body || {};
    const normalized = { ...body };

    // Ensure required text fields
    if (!normalized.shortDescription && normalized.description) {
      normalized.shortDescription = String(normalized.description).slice(0, 300);
    }

    // Provide a safe default thumbnail to satisfy schema requirement
    if (!normalized.thumbnail) {
      normalized.thumbnail = course.thumbnail || '';
    }

    // Normalize arrays if client sends comma-separated strings
    if (normalized.tags && !Array.isArray(normalized.tags)) {
      normalized.tags = String(normalized.tags).split(',').map(t => t.trim()).filter(Boolean);
    }
    if (normalized.requirements && !Array.isArray(normalized.requirements)) {
      normalized.requirements = String(normalized.requirements).split(',').map(t => t.trim()).filter(Boolean);
    }
    if (normalized.learningOutcomes && !Array.isArray(normalized.learningOutcomes)) {
      normalized.learningOutcomes = String(normalized.learningOutcomes).split(',').map(t => t.trim()).filter(Boolean);
    }

    const courseData = {
      ...normalized,
      // instructor: req.user.id
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during course creation'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if user can update this course
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this course'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName avatar');

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: {
        course: updatedCourse
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during course update'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if user can delete this course
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during course deletion'
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        status: 'error',
        message: 'Course is not available for enrollment'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    if (user.isEnrolledInCourse(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Already enrolled in this course'
      });
    }

    // Enroll user
    await user.enrollInCourse(req.params.id);
    
    // Increment course enrollment count
    await course.incrementEnrollment();

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'course_enrollment',
      title: 'Course Enrollment Confirmed',
      message: `You have successfully enrolled in "${course.title}"`,
      data: { courseId: course._id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during enrollment'
    });
  }
};

// @desc    Add course review
// @route   POST /api/courses/:id/reviews
// @access  Private
export const addCourseReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if user is enrolled
    if (!user.isEnrolledInCourse(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You must be enrolled in this course to leave a review'
      });
    }

    const { rating, title, comment } = req.body;

    // Create review
    const review = await Review.create({
      user: req.user.id,
      course: req.params.id,
      rating,
      title,
      comment,
      isVerified: true
    });

    // Add review to course and update rating
    await course.addReview(req.user.id, rating, comment);

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during review submission'
    });
  }
};

// @desc    Get course categories
// @route   GET /api/courses/categories/list
// @access  Public
export const getCourseCategories = async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get courses by instructor (for admin dashboard)
// @route   GET /api/courses/instructor/:instructorId
// @access  Private/Admin
export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const courses = await Course.find({ instructor: instructorId })
      .populate('instructor', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments({ instructor: instructorId });

    res.status(200).json({
      status: 'success',
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get courses by instructor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
