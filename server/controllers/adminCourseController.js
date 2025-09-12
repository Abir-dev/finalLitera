import Course from '../models/Course.js';
import Admin from '../models/Admin.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all courses (Admin view)
// @route   GET /api/admin/courses
// @access  Private/Admin
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
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
      .populate('instructor', 'firstName lastName email avatar')
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
    console.error('Get all courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get course by ID (Admin view)
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email avatar')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        course
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
// @route   POST /api/admin/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      level,
      language,
      duration,
      price,
      originalPrice,
      currency,
      tags,
      requirements,
      learningOutcomes,
      isPublished,
      isFeatured,
      isLaunchPad,
      videoUrl,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!title || !description || !shortDescription || !level || !duration || !price) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, short description, level, duration, and price are required'
      });
    }

    // Handle file uploads
    let thumbnailUrl = '';
    let videoUrls = [];

    // Handle thumbnail upload
    if (req.files && req.files.thumbnail) {
      const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0], 'lms-king/courses/thumbnails');
      if (thumbnailResult.success) {
        thumbnailUrl = thumbnailResult.data.secure_url;
        // Delete local file
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    } else if (imageUrl) {
      thumbnailUrl = imageUrl;
    }

    // Thumbnail is optional - no fallback needed

    // Handle video uploads
    if (req.files && req.files.videos) {
      for (const video of req.files.videos) {
        const videoResult = await uploadToCloudinary(video, 'lms-king/courses/videos', {
          resource_type: 'video',
          chunk_size: 6000000
        });
        if (videoResult.success) {
          videoUrls.push(videoResult.data.secure_url);
          // Delete local file
          fs.unlinkSync(video.path);
        }
      }
    }

    // Add video URL if provided
    if (videoUrl) {
      videoUrls.push(videoUrl);
    }

    // Create course
    const course = new Course({
      title,
      description,
      shortDescription,
      instructor: req.admin.id, // Admin as instructor
      category: category || 'other',
      level,
      language: language || 'English',
      duration,
      price,
      originalPrice: originalPrice || price,
      currency: currency || 'INR',
      thumbnail: thumbnailUrl,
      videos: videoUrls,
      // Support either comma-separated strings or arrays
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(tag => tag.trim()) : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? String(requirements).split(',').map(req => req.trim()) : []),
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : (learningOutcomes ? String(learningOutcomes).split(',').map(outcome => outcome.trim()) : []),
      isPublished: isPublished === 'true' || isPublished === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isLaunchPad: isLaunchPad === 'true' || isLaunchPad === true
    });

    await course.save();

    // Populate instructor info
    await course.populate('instructor', 'firstName lastName email avatar');

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
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const {
      title,
      description,
      shortDescription,
      category,
      level,
      language,
      duration,
      price,
      originalPrice,
      currency,
      tags,
      requirements,
      learningOutcomes,
      isPublished,
      isFeatured,
      isLaunchPad,
      videoUrl,
      imageUrl
    } = req.body;

    // Handle file uploads
    let thumbnailUrl = course.thumbnail;
    let videoUrls = [...course.videos];

    // Handle new thumbnail upload
    if (req.files && req.files.thumbnail) {
      // Delete old thumbnail from Cloudinary if it exists
      if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
        const publicId = course.thumbnail.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`lms-king/courses/thumbnails/${publicId}`);
      }

      const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0], 'lms-king/courses/thumbnails');
      if (thumbnailResult.success) {
        thumbnailUrl = thumbnailResult.data.secure_url;
        // Delete local file
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    } else if (imageUrl) {
      thumbnailUrl = imageUrl;
    }

    // Handle new video uploads
    if (req.files && req.files.videos) {
      for (const video of req.files.videos) {
        const videoResult = await uploadToCloudinary(video, 'lms-king/courses/videos', {
          resource_type: 'video',
          chunk_size: 6000000
        });
        if (videoResult.success) {
          videoUrls.push(videoResult.data.secure_url);
          // Delete local file
          fs.unlinkSync(video.path);
        }
      }
    }

    // Add new video URL if provided
    if (videoUrl && !videoUrls.includes(videoUrl)) {
      videoUrls.push(videoUrl);
    }

    // Update course
    const updateData = {
      title: title || course.title,
      description: description || course.description,
      shortDescription: shortDescription || course.shortDescription,
      category: category || course.category,
      level: level || course.level,
      language: language || course.language,
      duration: duration || course.duration,
      price: price || course.price,
      originalPrice: originalPrice || course.originalPrice,
      currency: currency || course.currency,
      thumbnail: thumbnailUrl,
      videos: videoUrls,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : course.tags,
      requirements: requirements ? requirements.split(',').map(req => req.trim()) : course.requirements,
      learningOutcomes: learningOutcomes ? learningOutcomes.split(',').map(outcome => outcome.trim()) : course.learningOutcomes,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : course.isPublished,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : course.isFeatured,
      isLaunchPad: isLaunchPad !== undefined ? (isLaunchPad === 'true' || isLaunchPad === true) : course.isLaunchPad
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email avatar');

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
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Delete files from Cloudinary
    if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
      const publicId = course.thumbnail.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`lms-king/courses/thumbnails/${publicId}`);
    }

    // Delete videos from Cloudinary
    for (const videoUrl of course.videos) {
      if (videoUrl.includes('cloudinary')) {
        const publicId = videoUrl.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`lms-king/courses/videos/${publicId}`);
      }
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

// @desc    Toggle course publish status
// @route   PATCH /api/admin/courses/:id/toggle-publish
// @access  Private/Admin
export const toggleCoursePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      status: 'success',
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Toggle course publish error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/admin/courses/stats/overview
// @access  Private/Admin
export const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = await Course.countDocuments({ isPublished: false });
    const featuredCourses = await Course.countDocuments({ isFeatured: true });

    // Courses by category
    const categoryStats = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Courses by level
    const levelStats = await Course.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent courses (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCourses = await Course.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.status(200).json({
      status: 'success',
      data: {
        totalCourses,
        publishedCourses,
        draftCourses,
        featuredCourses,
        recentCourses,
        categoryDistribution: categoryStats,
        levelDistribution: levelStats
      }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
