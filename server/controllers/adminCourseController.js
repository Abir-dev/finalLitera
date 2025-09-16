import Course from "../models/Course.js";
import Admin from "../models/Admin.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import {
  uploadToS3,
  deleteFromS3,
  parseKeyFromUrlIfNeeded,
} from "../utils/s3.js";
import fs from "fs";
import path from "path";

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
    if (req.query.isPublished !== undefined)
      filter.isPublished = req.query.isPublished === "true";
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { tags: { $in: [new RegExp(req.query.search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith("-")
        ? req.query.sort.slice(1)
        : req.query.sort;
      const sortOrder = req.query.sort.startsWith("-") ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "firstName lastName email avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get course by ID (Admin view)
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "firstName lastName email avatar")
      .populate("reviews.user", "firstName lastName avatar");

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
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
      imageUrl,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !shortDescription ||
      !level ||
      !duration ||
      !price
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Title, description, short description, level, duration, and price are required",
      });
    }

    // Handle file uploads
    let thumbnailUrl = "";
    let videoUrls = [];

    // Handle thumbnail upload
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      const thumbnailResult = await uploadToCloudinary(
        thumbnailFile,
        "lms-king/courses/thumbnails"
      );
      if (thumbnailResult.success) {
        thumbnailUrl = thumbnailResult.data.secure_url;
        // Delete local file if it exists
        if (thumbnailFile.path && fs.existsSync(thumbnailFile.path)) {
          try {
            fs.unlinkSync(thumbnailFile.path);
          } catch (error) {
            console.error("Error deleting thumbnail file:", error);
          }
        }
      }
    } else if (imageUrl) {
      thumbnailUrl = imageUrl;
    }

    // Thumbnail is optional - no fallback needed

    // Handle video uploads (S3)
    if (req.files && req.files.videos) {
      for (const video of req.files.videos) {
        const videoResult = await uploadToS3(video, "lms-king/courses/videos");
        if (videoResult.success) {
          videoUrls.push(videoResult.data.url);
          if (video.path && fs.existsSync(video.path)) {
            try {
              fs.unlinkSync(video.path);
            } catch (error) {
              console.error("Error deleting video file:", error);
            }
          }
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
      category: category || "other",
      level,
      language: language || "English",
      duration,
      price,
      originalPrice: originalPrice || price,
      currency: currency || "INR",
      thumbnail: thumbnailUrl,
      videos: videoUrls,
      // Support either comma-separated strings or arrays
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? String(tags)
            .split(",")
            .map((tag) => tag.trim())
        : [],
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements
        ? String(requirements)
            .split(",")
            .map((req) => req.trim())
        : [],
      learningOutcomes: Array.isArray(learningOutcomes)
        ? learningOutcomes
        : learningOutcomes
        ? String(learningOutcomes)
            .split(",")
            .map((outcome) => outcome.trim())
        : [],
      isPublished: isPublished === "true" || isPublished === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isLaunchPad: isLaunchPad === "true" || isLaunchPad === true,
      schedule: {
        isSelfPaced: true,
        liveSessions: [],
      },
    });

    await course.save();

    // Populate instructor info
    await course.populate("instructor", "firstName lastName email avatar");

    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during course creation",
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
        status: "error",
        message: "Course not found",
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
      imageUrl,
    } = req.body;

    // Handle file uploads
    let thumbnailUrl = course.thumbnail;
    let videoUrls = [...course.videos];

    // Handle new thumbnail upload
    if (req.files && req.files.thumbnail) {
      // Delete old thumbnail from Cloudinary if it exists
      if (course.thumbnail && course.thumbnail.includes("cloudinary")) {
        const publicId = course.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`lms-king/courses/thumbnails/${publicId}`);
      }

      const thumbnailResult = await uploadToCloudinary(
        req.files.thumbnail[0],
        "lms-king/courses/thumbnails"
      );
      if (thumbnailResult.success) {
        thumbnailUrl = thumbnailResult.data.secure_url;
        // Delete local file
        fs.unlinkSync(req.files.thumbnail[0].path);
      }
    } else if (imageUrl) {
      thumbnailUrl = imageUrl;
    }

    // Handle new video uploads (S3)
    if (req.files && req.files.videos) {
      for (const video of req.files.videos) {
        const videoResult = await uploadToS3(video, "lms-king/courses/videos");
        if (videoResult.success) {
          videoUrls.push(videoResult.data.url);
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
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : course.tags,
      requirements: requirements
        ? requirements.split(",").map((req) => req.trim())
        : course.requirements,
      learningOutcomes: learningOutcomes
        ? learningOutcomes.split(",").map((outcome) => outcome.trim())
        : course.learningOutcomes,
      isPublished:
        isPublished !== undefined
          ? isPublished === "true" || isPublished === true
          : course.isPublished,
      isFeatured:
        isFeatured !== undefined
          ? isFeatured === "true" || isFeatured === true
          : course.isFeatured,
      isLaunchPad:
        isLaunchPad !== undefined
          ? isLaunchPad === "true" || isLaunchPad === true
          : course.isLaunchPad,
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("instructor", "firstName lastName email avatar");

    res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during course update",
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
        status: "error",
        message: "Course not found",
      });
    }

    // Delete files from Cloudinary
    if (course.thumbnail && course.thumbnail.includes("cloudinary")) {
      const publicId = course.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`lms-king/courses/thumbnails/${publicId}`);
    }

    // Delete videos from storage
    for (const videoUrl of course.videos) {
      if (typeof videoUrl === "string" && videoUrl.includes("cloudinary")) {
        const publicId = videoUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`lms-king/courses/videos/${publicId}`);
      } else if (typeof videoUrl === "string") {
        try {
          const key = parseKeyFromUrlIfNeeded(videoUrl);
          await deleteFromS3(key);
        } catch (e) {
          console.error("Error deleting from S3:", e);
        }
      }
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during course deletion",
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
        status: "error",
        message: "Course not found",
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      status: "success",
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      } successfully`,
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Toggle course publish error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Update course meet links
// @route   PUT /api/admin/courses/:id/meet-links
// @access  Private/Admin
export const updateCourseMeetLinks = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    const { meetLink, isLiveClass, sessionDate, sessionDuration } = req.body;

    // Handle live class settings
    let liveSessions = course.schedule?.liveSessions || [];

    if (isLiveClass === true || isLiveClass === "true") {
      if (!meetLink) {
        return res.status(400).json({
          status: "error",
          message: "Meeting link is required when enabling live class",
        });
      }

      // Compute date and duration overrides if provided
      const parsedDate = sessionDate ? new Date(sessionDate) : null;
      const parsedDuration = sessionDuration
        ? Number(sessionDuration)
        : course.duration || 60;

      // Update or create live session (single primary session supported)
      if (liveSessions.length > 0) {
        liveSessions[0].meetingLink = meetLink;
        liveSessions[0].title = course.title;
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          liveSessions[0].date = parsedDate;
        } else if (!liveSessions[0].date) {
          liveSessions[0].date = new Date();
        }
        liveSessions[0].duration = !isNaN(parsedDuration)
          ? parsedDuration
          : course.duration || 60;
      } else {
        liveSessions = [
          {
            title: course.title,
            date:
              parsedDate && !isNaN(parsedDate.getTime())
                ? parsedDate
                : new Date(),
            duration: !isNaN(parsedDuration)
              ? parsedDuration
              : course.duration || 60,
            meetingLink: meetLink,
          },
        ];
      }
    } else if (isLiveClass === false || isLiveClass === "false") {
      // Disable live class
      liveSessions = [];
    }

    // Update course with new live session data
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        schedule: {
          isSelfPaced: !(isLiveClass === true || isLiveClass === "true"),
          liveSessions: liveSessions,
        },
      },
      { new: true, runValidators: true }
    ).populate("instructor", "firstName lastName email avatar");

    // Create notifications for enrolled users when a live class is scheduled
    if (
      (isLiveClass === true || isLiveClass === "true") &&
      liveSessions.length > 0
    ) {
      const targetDate = liveSessions[0].date;
      const durationMin = liveSessions[0].duration;

      // Find users enrolled in this course (support both Enrollment model and User.enrolledCourses fallback)
      let userIds = [];
      try {
        const enrollments = await Enrollment.find(
          { course: updatedCourse._id },
          "user"
        ).populate("user", "_id");
        userIds = enrollments.map((e) => e.user?._id).filter(Boolean);
      } catch (e) {
        // Fallback to scanning User model embedded enrollments
        const users = await User.find(
          { "enrolledCourses.course": updatedCourse._id },
          "_id"
        );
        userIds = users.map((u) => u._id);
      }

      if (userIds.length > 0) {
        const notifications = userIds.map((uid) => ({
          user: uid,
          type: "live_class_scheduled",
          title: `Live class scheduled: ${updatedCourse.title}`,
          message: `A live class is scheduled on ${new Date(
            targetDate
          ).toLocaleString()} for ${durationMin} minutes.`,
          data: {
            courseId: updatedCourse._id,
            sessionDate: targetDate,
            sessionDuration: durationMin,
            meetingLink: liveSessions[0].meetingLink,
          },
          priority: "high",
          actionUrl: `/live`,
          actionText: "View Live Classes",
        }));

        const created = await Notification.insertMany(notifications);

        // Emit over Socket.IO if available
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
      }
    }

    res.status(200).json({
      status: "success",
      message: "Meet links updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    console.error("Update meet links error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during meet links update",
    });
  }
};

// @desc    Test courses endpoint (Admin only)
// @route   GET /api/admin/courses/test
// @access  Private/Admin
export const testCourses = async (req, res) => {
  try {
    console.log("Testing courses endpoint...");

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });

    res.status(200).json({
      status: "success",
      message: "Courses endpoint working",
      data: {
        totalCourses,
        publishedCourses,
      },
    });
  } catch (error) {
    console.error("Test courses error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error in test endpoint",
      error: error.message,
    });
  }
};

// @desc    Get available courses for assignment (Admin only)
// @route   GET /api/admin/courses/available
// @access  Private/Admin
export const getAvailableCourses = async (req, res) => {
  try {
    console.log("Fetching available courses...");
    console.log("Admin ID:", req.admin?.id);

    // First, let's check if there are any courses at all
    const totalCourses = await Course.countDocuments();
    console.log(`Total courses in database: ${totalCourses}`);

    // Get published courses without instructor population first
    const courses = await Course.find({ isPublished: true })
      .select(
        "_id title description thumbnail level category duration price instructor"
      )
      .sort({ title: 1 });

    console.log(`Found ${courses.length} published courses`);

    // If no published courses, return empty array
    if (courses.length === 0) {
      console.log("No published courses found, returning empty array");
      return res.status(200).json({
        status: "success",
        data: {
          courses: [],
        },
      });
    }

    // Try to populate instructor for each course individually to avoid errors
    const coursesWithInstructor = await Promise.all(
      courses.map(async (course) => {
        try {
          // Ensure course object is valid
          if (!course || !course._id) {
            console.error("Invalid course object:", course);
            return null;
          }

          // Create a clean course object with only the fields we need
          const cleanCourse = {
            _id: course._id,
            title: course.title || "Untitled Course",
            description: course.description || "",
            thumbnail: course.thumbnail || "",
            level: course.level || "beginner",
            category: course.category || "other",
            duration: course.duration || "00:00:00",
            price: course.price || 0,
            instructor: null,
          };

          // Try to populate instructor if it exists
          if (course.instructor) {
            try {
              await course.populate("instructor", "firstName lastName");
              cleanCourse.instructor = course.instructor;
            } catch (populateError) {
              console.error(
                `Error populating instructor for course ${course._id}:`,
                populateError
              );
              cleanCourse.instructor = null;
            }
          }

          return cleanCourse;
        } catch (error) {
          console.error(`Error processing course ${course?._id}:`, error);
          return null;
        }
      })
    );

    // Filter out any null courses
    const validCourses = coursesWithInstructor.filter(
      (course) => course !== null
    );

    console.log(`Successfully processed ${validCourses.length} valid courses`);

    res.status(200).json({
      status: "success",
      data: {
        courses: validCourses,
      },
    });
  } catch (error) {
    console.error("Get available courses error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching available courses",
      error: error.message,
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
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Courses by level
    const levelStats = await Course.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent courses (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCourses = await Course.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      status: "success",
      data: {
        totalCourses,
        publishedCourses,
        draftCourses,
        featuredCourses,
        recentCourses,
        categoryDistribution: categoryStats,
        levelDistribution: levelStats,
      },
    });
  } catch (error) {
    console.error("Get course stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
