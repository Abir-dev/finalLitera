import LiveClass from "../models/LiveClass.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Get all live classes
// @route   GET /api/live-classes
// @access  Public
export const getLiveClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.instructor) filter.instructor = req.query.instructor;
    if (req.query.isLiveNow !== undefined) {
      filter.isLiveNow = req.query.isLiveNow === "true";
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter["classTiming.startTime"] = {};
      if (req.query.startDate) {
        filter["classTiming.startTime"].$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter["classTiming.startTime"].$lte = new Date(req.query.endDate);
      }
    }

    // Search filter
    if (req.query.q) {
      filter.className = { $regex: req.query.q, $options: "i" };
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
      sort["classTiming.startTime"] = 1;
    }

    const liveClasses = await LiveClass.find(filter)
      .populate("instructor", "firstName lastName avatar")
      .populate("enrolledStudents.student", "firstName lastName avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await LiveClass.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        liveClasses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalClasses: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get live classes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get currently live classes
// @route   GET /api/live-classes/live
// @access  Public
export const getCurrentlyLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.findLiveClasses()
      .populate("instructor", "firstName lastName avatar")
      .populate("enrolledStudents.student", "firstName lastName avatar")
      .sort({ "classTiming.startTime": 1 });

    res.status(200).json({
      status: "success",
      data: {
        liveClasses,
        count: liveClasses.length,
      },
    });
  } catch (error) {
    console.error("Get currently live classes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get upcoming live classes
// @route   GET /api/live-classes/upcoming
// @access  Public
export const getUpcomingLiveClasses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const liveClasses = await LiveClass.findUpcomingClasses(limit)
      .populate("instructor", "firstName lastName avatar")
      .populate("enrolledStudents.student", "firstName lastName avatar");

    res.status(200).json({
      status: "success",
      data: {
        liveClasses,
        count: liveClasses.length,
      },
    });
  } catch (error) {
    console.error("Get upcoming live classes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get live class by ID
// @route   GET /api/live-classes/:id
// @access  Public
export const getLiveClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate("instructor", "firstName lastName avatar profile.bio")
      .populate("enrolledStudents.student", "firstName lastName avatar")
      .populate("chatHistory.user", "firstName lastName avatar");

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    let enrollmentStatus = null;

    if (req.user) {
      const enrollment = liveClass.enrolledStudents.find(
        (enrollment) =>
          enrollment.student._id.toString() === req.user.id.toString()
      );
      if (enrollment) {
        isEnrolled = true;
        enrollmentStatus = enrollment.attendanceStatus;
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        liveClass,
        enrollment: {
          isEnrolled,
          status: enrollmentStatus,
        },
      },
    });
  } catch (error) {
    console.error("Get live class error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Create new live class
// @route   POST /api/live-classes
// @access  Private/Instructor/Admin
export const createLiveClass = async (req, res) => {
  try {
    const {
      className,
      classTiming,
      gmeetLink,
      description,
      category,
      level,
      maxParticipants,
      isRecurring,
      recurringPattern,
    } = req.body;

    // Validate required fields
    if (!className || !classTiming || !gmeetLink) {
      return res.status(400).json({
        status: "error",
        message: "Class name, timing, and Google Meet link are required",
      });
    }

    // Validate timing
    if (!classTiming.startTime || !classTiming.endTime) {
      return res.status(400).json({
        status: "error",
        message: "Start time and end time are required",
      });
    }

    const startTime = new Date(classTiming.startTime);
    const endTime = new Date(classTiming.endTime);

    if (startTime >= endTime) {
      return res.status(400).json({
        status: "error",
        message: "Start time must be before end time",
      });
    }

    if (startTime <= new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Start time must be in the future",
      });
    }

    const liveClassData = {
      className: className.trim(),
      classTiming: {
        startTime,
        endTime,
        timezone: classTiming.timezone || "UTC",
      },
      gmeetLink: gmeetLink.trim(),
      instructor: req.user.id,
      description: description?.trim(),
      category: category || "other",
      level: level || "beginner",
      maxParticipants: maxParticipants || 100,
      isRecurring: isRecurring || false,
      recurringPattern: isRecurring ? recurringPattern : undefined,
    };

    const liveClass = await LiveClass.create(liveClassData);

    // Populate instructor data
    await liveClass.populate("instructor", "firstName lastName avatar");

    res.status(201).json({
      status: "success",
      message: "Live class created successfully",
      data: {
        liveClass,
      },
    });
  } catch (error) {
    console.error("Create live class error:", error);

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
      message: "Server error during live class creation",
    });
  }
};

// @desc    Update live class
// @route   PUT /api/live-classes/:id
// @access  Private/Instructor/Admin
export const updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user can update this live class
    if (
      req.user.role !== "admin" &&
      liveClass.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this live class",
      });
    }

    // Don't allow updates if class has already started
    if (new Date() >= liveClass.classTiming.startTime) {
      return res.status(400).json({
        status: "error",
        message: "Cannot update a live class that has already started",
      });
    }

    const updatedLiveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("instructor", "firstName lastName avatar");

    res.status(200).json({
      status: "success",
      message: "Live class updated successfully",
      data: {
        liveClass: updatedLiveClass,
      },
    });
  } catch (error) {
    console.error("Update live class error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during live class update",
    });
  }
};

// @desc    Delete live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Instructor/Admin
export const deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user can delete this live class
    if (
      req.user.role !== "admin" &&
      liveClass.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this live class",
      });
    }

    // Don't allow deletion if class has already started
    if (new Date() >= liveClass.classTiming.startTime) {
      return res.status(400).json({
        status: "error",
        message: "Cannot delete a live class that has already started",
      });
    }

    await LiveClass.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Live class deleted successfully",
    });
  } catch (error) {
    console.error("Delete live class error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during live class deletion",
    });
  }
};

// @desc    Enroll in live class
// @route   POST /api/live-classes/:id/enroll
// @access  Private
export const enrollInLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    if (liveClass.status === "cancelled") {
      return res.status(400).json({
        status: "error",
        message: "This live class has been cancelled",
      });
    }

    try {
      await liveClass.enrollStudent(req.user.id);

      // Create notification
      await Notification.create({
        user: req.user.id,
        type: "live_class_enrollment",
        title: "Live Class Enrollment Confirmed",
        message: `You have successfully enrolled in "${liveClass.className}"`,
        data: { liveClassId: liveClass._id },
      });

      res.status(200).json({
        status: "success",
        message: "Successfully enrolled in live class",
      });
    } catch (enrollmentError) {
      return res.status(400).json({
        status: "error",
        message: enrollmentError.message,
      });
    }
  } catch (error) {
    console.error("Enroll in live class error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during enrollment",
    });
  }
};

// @desc    Mark attendance for live class
// @route   POST /api/live-classes/:id/attendance
// @access  Private/Instructor/Admin
export const markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({
        status: "error",
        message: "Student ID and attendance status are required",
      });
    }

    if (!["enrolled", "attended", "absent"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid attendance status",
      });
    }

    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user can mark attendance
    if (
      req.user.role !== "admin" &&
      liveClass.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to mark attendance for this live class",
      });
    }

    try {
      await liveClass.markAttendance(studentId, status);

      res.status(200).json({
        status: "success",
        message: "Attendance marked successfully",
      });
    } catch (attendanceError) {
      return res.status(400).json({
        status: "error",
        message: attendanceError.message,
      });
    }
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during attendance marking",
    });
  }
};

// @desc    Add chat message to live class
// @route   POST /api/live-classes/:id/chat
// @access  Private
export const addChatMessage = async (req, res) => {
  try {
    const { message, messageType } = req.body;

    if (!message) {
      return res.status(400).json({
        status: "error",
        message: "Message is required",
      });
    }

    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user is enrolled
    const isEnrolled = liveClass.enrolledStudents.some(
      (enrollment) => enrollment.student.toString() === req.user.id.toString()
    );

    if (!isEnrolled && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "You must be enrolled in this live class to send messages",
      });
    }

    await liveClass.addChatMessage(req.user.id, message, messageType);

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Add chat message error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during message sending",
    });
  }
};

// @desc    Rate live class
// @route   POST /api/live-classes/:id/rate
// @access  Private
export const rateLiveClass = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        message: "Rating must be between 1 and 5",
      });
    }

    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user is enrolled and class is completed
    const isEnrolled = liveClass.enrolledStudents.some(
      (enrollment) => enrollment.student.toString() === req.user.id.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        status: "error",
        message: "You must be enrolled in this live class to rate it",
      });
    }

    if (liveClass.status !== "completed") {
      return res.status(400).json({
        status: "error",
        message: "You can only rate completed live classes",
      });
    }

    await liveClass.addRating(rating);

    res.status(200).json({
      status: "success",
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error("Rate live class error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during rating submission",
    });
  }
};

// @desc    Get live classes by instructor
// @route   GET /api/live-classes/instructor/:instructorId
// @access  Private/Admin
export const getLiveClassesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const liveClasses = await LiveClass.find({ instructor: instructorId })
      .populate("instructor", "firstName lastName avatar")
      .populate("enrolledStudents.student", "firstName lastName avatar")
      .sort({ "classTiming.startTime": -1 })
      .skip(skip)
      .limit(limit);

    const total = await LiveClass.countDocuments({ instructor: instructorId });

    res.status(200).json({
      status: "success",
      data: {
        liveClasses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalClasses: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get live classes by instructor error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Update live class status (for admin/instructor)
// @route   PUT /api/live-classes/:id/status
// @access  Private/Instructor/Admin
export const updateLiveClassStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["scheduled", "live", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status",
      });
    }

    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: "error",
        message: "Live class not found",
      });
    }

    // Check if user can update status
    if (
      req.user.role !== "admin" &&
      liveClass.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update status for this live class",
      });
    }

    liveClass.status = status;
    await liveClass.updateLiveStatus();

    res.status(200).json({
      status: "success",
      message: "Live class status updated successfully",
      data: {
        liveClass,
      },
    });
  } catch (error) {
    console.error("Update live class status error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during status update",
    });
  }
};
