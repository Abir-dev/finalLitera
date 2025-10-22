import LiveClassRecording from "../models/LiveClassRecording.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { uploadToR2 } from "../utils/r2.js";

// @desc    Get all live class recordings
// @route   GET /api/live-class-recordings
// @access  Private/Admin
export const getLiveClassRecordings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      course,
      dateFrom,
      dateTo,
      search,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    if (course) {
      query.course = course;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { lectureNumber: { $regex: search, $options: "i" } },
        { hostedBy: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const recordings = await LiveClassRecording.find(query)
      .populate("course", "title")
      .populate("uploadedBy", "firstName lastName")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await LiveClassRecording.countDocuments(query);

    res.status(200).json({
      status: "success",
      data: {
        recordings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching live class recordings:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get live class recording by ID for students
// @route   GET /api/live-class-recordings/student/:id
// @access  Private
export const getStudentRecordingById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Student recording by ID debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      recordingId: id,
      userEmail: req.user?.email,
    });

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    // Get the recording
    const recording = await LiveClassRecording.findById(id)
      .populate("course", "title description")
      .populate("uploadedBy", "firstName lastName email");

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: recording.course._id,
    });

    // Also check user's enrolledCourses array
    const user = await User.findById(req.user.id);
    const userEnrolled = user.enrolledCourses.some(
      (enrollment) =>
        enrollment.course.toString() === recording.course._id.toString()
    );

    if (!enrollment && !userEnrolled) {
      return res.status(403).json({
        status: "error",
        message: "You are not enrolled in this course",
      });
    }

    // Increment views
    await recording.incrementViews();

    res.status(200).json({
      status: "success",
      data: { recording },
    });
  } catch (error) {
    console.error("Error fetching student recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get live class recording by ID
// @route   GET /api/live-class-recordings/:id
// @access  Private/Admin
export const getLiveClassRecordingById = async (req, res) => {
  try {
    const { includeEnrolledUsers = false } = req.query;

    const recording = await LiveClassRecording.findById(req.params.id)
      .populate("course", "title description")
      .populate("uploadedBy", "firstName lastName email");

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    // Increment views
    await recording.incrementViews();

    let enrolledUsers = null;

    // Optionally include enrolled users if requested
    if (includeEnrolledUsers === "true") {
      try {
        enrolledUsers = await LiveClassRecording.getEnrolledUsersByCourse(
          recording.course._id
        );
        console.log(
          `Found ${enrolledUsers.length} enrolled users for course ${recording.course._id}`
        );
      } catch (enrolledUsersError) {
        console.error("Error fetching enrolled users:", enrolledUsersError);
        // Don't fail the request if enrolled users can't be fetched
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        recording,
        ...(enrolledUsers && {
          enrolledUsers: enrolledUsers.map((enrollment) => ({
            _id: enrollment._id,
            user: {
              _id: enrollment.user._id,
              firstName: enrollment.user.firstName,
              lastName: enrollment.user.lastName,
              email: enrollment.user.email,
              profilePicture: enrollment.user.profilePicture,
            },
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            status: enrollment.status,
          })),
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Create new live class recording
// @route   POST /api/live-class-recordings
// @access  Private/Admin
export const createLiveClassRecording = async (req, res) => {
  try {
    // Debug authentication
    console.log("Authentication debug:", {
      hasUser: !!req.user,
      hasAdmin: !!req.admin,
      userId: req.user?.id,
      adminId: req.admin?.id,
      userRole: req.user?.role,
      adminRole: req.admin?.role,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
    });

    // Check if user is authenticated (adminAuth sets req.admin, not req.user)
    if (!req.admin) {
      console.error("Authentication error: req.admin is undefined");
      return res.status(401).json({
        status: "error",
        message: "Admin authentication required",
      });
    }

    const {
      lectureNumber,
      date,
      duration,
      startTime,
      endTime,
      hostedBy,
      courseId,
      description,
      recordingUrl,
      fileSize,
    } = req.body;

    // Validate required fields
    if (
      !lectureNumber ||
      !date ||
      !duration ||
      !startTime ||
      !endTime ||
      !hostedBy ||
      !courseId
    ) {
      return res.status(400).json({
        status: "error",
        message: "All required fields must be provided",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check if recording URL is provided (for direct URL uploads)
    if (!recordingUrl && !req.file) {
      return res.status(400).json({
        status: "error",
        message: "Recording URL or file must be provided",
      });
    }

    let finalRecordingUrl = recordingUrl;
    let finalFileSize = fileSize;

    // Handle file upload if file is provided
    if (req.file) {
      try {
        console.log("Starting video upload to R2...");
        const uploadResult = await uploadToR2(req.file, "lms-king/videos", {
          metadata: {
            originalName: req.file.originalname,
            fieldname: req.file.fieldname,
            type: "video",
          },
        });

        console.log("Upload result:", uploadResult);

        if (!uploadResult.success) {
          console.error("Error uploading video:", uploadResult.error);
          return res.status(500).json({
            status: "error",
            message: "Failed to upload video file",
            error: uploadResult.error,
          });
        }

        finalRecordingUrl = uploadResult.data.secure_url;
        finalFileSize = req.file.size;

        console.log("Video uploaded successfully. URL:", finalRecordingUrl);
        console.log("File size:", finalFileSize);

        // Verify URL is accessible
        try {
          const response = await fetch(finalRecordingUrl, { method: "HEAD" });
          console.log("URL accessibility check:", response.status);
          if (response.status !== 200) {
            console.warn(
              "Warning: Uploaded URL may not be accessible:",
              finalRecordingUrl
            );
          }
        } catch (urlError) {
          console.warn(
            "Warning: Could not verify URL accessibility:",
            urlError.message
          );
        }
      } catch (uploadError) {
        console.error("Error uploading video:", uploadError);
        return res.status(500).json({
          status: "error",
          message: "Failed to upload video file",
        });
      }
    }

    const recordingData = {
      lectureNumber: lectureNumber.trim(),
      date: new Date(date),
      duration: duration.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      hostedBy: hostedBy.trim(),
      course: courseId,
      description: description?.trim(),
      recordingUrl: finalRecordingUrl,
      fileSize: finalFileSize,
      uploadedBy: req.admin.id,
    };

    // Final validation before saving
    if (!finalRecordingUrl) {
      console.error("CRITICAL ERROR: No recording URL available!");
      return res.status(400).json({
        status: "error",
        message: "Recording URL is required but not provided",
      });
    }

    console.log("Recording data to be saved:", {
      ...recordingData,
      recordingUrl: finalRecordingUrl,
      fileSize: finalFileSize,
    });

    const recording = await LiveClassRecording.create(recordingData);

    console.log("Recording created successfully:", {
      id: recording._id,
      recordingUrl: recording.recordingUrl,
      fileSize: recording.fileSize,
    });

    // Additional verification - check if URL was actually saved
    if (!recording.recordingUrl) {
      console.error("CRITICAL ERROR: Recording URL is missing after create!");
      console.error("Recording data that was passed:", recordingData);
      return res.status(500).json({
        status: "error",
        message: "Failed to save recording URL to database",
      });
    }

    // Populate the created recording
    await recording.populate([
      { path: "course", select: "title" },
      { path: "uploadedBy", select: "firstName lastName" },
    ]);

    console.log("Final recording object before response:", {
      id: recording._id,
      recordingUrl: recording.recordingUrl,
      fileSize: recording.fileSize,
      course: recording.course,
    });

    // Verify the recording was saved correctly by fetching it from database
    try {
      const savedRecording = await LiveClassRecording.findById(recording._id);
      console.log("Verification - Recording from database:", {
        id: savedRecording._id,
        recordingUrl: savedRecording.recordingUrl,
        fileSize: savedRecording.fileSize,
      });

      if (!savedRecording.recordingUrl) {
        console.error("ERROR: Recording URL is not saved in database!");
      }
    } catch (verifyError) {
      console.error("Error verifying saved recording:", verifyError);
    }

    res.status(201).json({
      status: "success",
      message: "Recording uploaded successfully",
      data: { recording },
    });
  } catch (error) {
    console.error("Error creating recording:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    // Clean up any temporary files if they exist
    if (req.file && req.file.path) {
      try {
        const fs = await import("fs");
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log("Cleaned up temporary file:", req.file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }

    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${error.message}`
          : "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Update live class recording
// @route   PUT /api/live-class-recordings/:id
// @access  Private/Admin
export const updateLiveClassRecording = async (req, res) => {
  try {
    const {
      lectureNumber,
      date,
      duration,
      startTime,
      endTime,
      hostedBy,
      courseId,
      description,
      isPublic,
    } = req.body;

    const recording = await LiveClassRecording.findById(req.params.id);

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    // Check if course exists (if courseId is being updated)
    if (courseId && courseId !== recording.course.toString()) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          status: "error",
          message: "Course not found",
        });
      }
    }

    // Update fields
    if (lectureNumber) recording.lectureNumber = lectureNumber.trim();
    if (date) recording.date = new Date(date);
    if (duration) recording.duration = duration.trim();
    if (startTime) recording.startTime = startTime.trim();
    if (endTime) recording.endTime = endTime.trim();
    if (hostedBy) recording.hostedBy = hostedBy.trim();
    if (courseId) recording.course = courseId;
    if (description !== undefined) recording.description = description?.trim();
    if (isPublic !== undefined) recording.isPublic = isPublic;

    await recording.save();

    // Populate the updated recording
    await recording.populate([
      { path: "course", select: "title" },
      { path: "uploadedBy", select: "firstName lastName" },
    ]);

    res.status(200).json({
      status: "success",
      message: "Recording updated successfully",
      data: { recording },
    });
  } catch (error) {
    console.error("Error updating recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Delete live class recording
// @route   DELETE /api/live-class-recordings/:id
// @access  Private/Admin
export const deleteLiveClassRecording = async (req, res) => {
  try {
    const recording = await LiveClassRecording.findById(req.params.id);

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    // TODO: Delete the actual video file from storage
    // await deleteFromR2(recording.recordingUrl);

    await LiveClassRecording.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Recording deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get recordings by course
// @route   GET /api/live-class-recordings/course/:courseId
// @access  Private/Admin
export const getRecordingsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, includeEnrolledUsers = false } = req.query;

    const recordings = await LiveClassRecording.findByCourse(courseId)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LiveClassRecording.countDocuments({ course: courseId });

    let enrolledUsersCount = null;
    let enrolledUsers = null;

    // Optionally include enrolled users information
    if (includeEnrolledUsers === "true") {
      try {
        enrolledUsers = await LiveClassRecording.getEnrolledUsersByCourse(
          courseId
        );
        enrolledUsersCount = enrolledUsers.length;
        console.log(
          `Found ${enrolledUsersCount} enrolled users for course ${courseId}`
        );
      } catch (enrolledUsersError) {
        console.error("Error fetching enrolled users:", enrolledUsersError);
        // Don't fail the request if enrolled users can't be fetched
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        recordings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
        ...(enrolledUsersCount !== null && {
          enrolledUsersCount,
          ...(enrolledUsers && {
            enrolledUsers: enrolledUsers.map((enrollment) => ({
              _id: enrollment._id,
              user: {
                _id: enrollment.user._id,
                firstName: enrollment.user.firstName,
                lastName: enrollment.user.lastName,
                email: enrollment.user.email,
                profilePicture: enrollment.user.profilePicture,
              },
              enrolledAt: enrollment.enrolledAt,
              progress: enrollment.progress,
              status: enrollment.status,
            })),
          }),
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching recordings by course:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get recordings for student's enrolled courses
// @route   GET /api/live-class-recordings/student
// @access  Private
export const getStudentRecordings = async (req, res) => {
  try {
    // Debug authentication
    console.log("Student recordings debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      userRole: req.user?.role,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
    });

    // Check if user is authenticated
    if (!req.user) {
      console.error("Authentication error: req.user is undefined");
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const userId = req.user.id;

    // Get user's enrolled courses from both systems
    console.log("Fetching enrollments for user:", userId);

    // Get from Enrollment collection
    const enrollmentCollection = await Enrollment.find({ user: userId })
      .populate("course", "title thumbnail description category instructor")
      .sort({ enrolledAt: -1 });

    // Get from User's enrolledCourses array
    const user = await User.findById(userId).populate(
      "enrolledCourses.course",
      "title thumbnail description category instructor"
    );

    console.log(
      `Found ${enrollmentCollection.length} enrollments from Enrollment collection`
    );
    console.log(
      `Found ${user.enrolledCourses.length} enrollments from User's enrolledCourses`
    );

    // Combine both enrollment sources
    const allEnrollments = [];

    // Add enrollments from Enrollment collection
    enrollmentCollection.forEach((enrollment) => {
      if (enrollment.course && enrollment.course._id) {
        allEnrollments.push({
          _id: enrollment._id,
          user: enrollment.user,
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          source: "enrollment_collection",
        });
      }
    });

    // Add enrollments from User's enrolledCourses array
    user.enrolledCourses.forEach((enrollment) => {
      if (enrollment.course && enrollment.course._id) {
        // Check if this enrollment already exists from the collection
        const exists = allEnrollments.some(
          (existing) =>
            existing.course._id.toString() === enrollment.course._id.toString()
        );

        if (!exists) {
          allEnrollments.push({
            _id: `user_${enrollment.course._id}`, // Generate a unique ID
            user: userId,
            course: enrollment.course,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            source: "user_enrolledCourses",
          });
        }
      }
    });

    console.log(`Total combined enrollments: ${allEnrollments.length}`);
    const enrollments = allEnrollments;

    if (enrollments.length === 0) {
      console.log("No enrollments found for user");
      return res.status(200).json({
        status: "success",
        data: {
          courses: [],
          message: "No enrolled courses found",
        },
      });
    }

    // Filter out enrollments with deleted courses and get course IDs
    const validEnrollments = enrollments.filter(
      (enrollment) => enrollment.course && enrollment.course._id
    );
    console.log(
      `Valid enrollments: ${validEnrollments.length} out of ${enrollments.length}`
    );

    if (validEnrollments.length === 0) {
      console.log(
        "No valid enrollments found (all courses may have been deleted)"
      );
      return res.status(200).json({
        status: "success",
        data: {
          courses: [],
          message: "No valid enrolled courses found",
        },
      });
    }

    const courseIds = validEnrollments.map(
      (enrollment) => enrollment.course._id
    );
    console.log("Course IDs:", courseIds);

    // Get recordings for enrolled courses grouped by course
    console.log("Fetching recordings for courses...");
    const coursesWithRecordings = await Promise.all(
      validEnrollments.map(async (enrollment) => {
        console.log(`Fetching recordings for course: ${enrollment.course._id}`);

        // First, let's check all recordings for this course (regardless of status)
        const allRecordings = await LiveClassRecording.find({
          course: enrollment.course._id,
        }).sort({ date: -1 });

        console.log(
          `Found ${allRecordings.length} total recordings for course ${enrollment.course._id}`
        );

        // Log recording details for debugging
        allRecordings.forEach((recording, index) => {
          console.log(`Recording ${index + 1}:`, {
            id: recording._id,
            lectureNumber: recording.lectureNumber,
            status: recording.status,
            hasUrl: !!recording.recordingUrl,
            urlLength: recording.recordingUrl
              ? recording.recordingUrl.length
              : 0,
            date: recording.date,
          });
        });

        // Filter for ready and uploaded recordings
        const recordings = allRecordings.filter(
          (recording) =>
            recording.status === "ready" || recording.status === "uploaded"
        );

        console.log(
          `Found ${recordings.length} ready recordings for course ${enrollment.course._id} (out of ${allRecordings.length} total)`
        );

        return {
          course: {
            _id: enrollment.course._id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail,
            description: enrollment.course.description,
            category: enrollment.course.category,
            instructor: enrollment.course.instructor,
          },
          recordings: recordings.map((recording) => ({
            _id: recording._id,
            lectureNumber: recording.lectureNumber,
            date: recording.date,
            duration: recording.duration,
            hostedBy: recording.hostedBy,
            description: recording.description,
            recordingUrl: recording.recordingUrl,
            views: recording.views,
            status: recording.status,
          })),
          totalRecordings: recordings.length,
        };
      })
    );

    // Don't filter out courses with no recordings - show all enrolled courses
    // This allows users to see their enrolled courses even if no recordings exist yet
    console.log(
      `Returning ${coursesWithRecordings.length} courses (including those without recordings)`
    );

    res.status(200).json({
      status: "success",
      data: {
        courses: coursesWithRecordings,
        totalCourses: coursesWithRecordings.length,
        coursesWithRecordings: coursesWithRecordings.filter(
          (course) => course.recordings.length > 0
        ).length,
        coursesWithoutRecordings: coursesWithRecordings.filter(
          (course) => course.recordings.length === 0
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching student recordings:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${error.message}`
          : "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Get recordings for a specific course by enrollment ID
// @route   GET /api/live-class-recordings/student/enrollment/:enrollmentId
// @access  Private
export const getRecordingsByEnrollmentId = async (req, res) => {
  try {
    // Debug authentication
    console.log("Student recordings by enrollment debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      enrollmentId: req.params.enrollmentId,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
      authHeader: req.headers.authorization,
      userEmail: req.user?.email,
    });

    // Check if user is authenticated
    if (!req.user) {
      console.error("Authentication error: req.user is undefined");
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const userId = req.user.id;
    const { enrollmentId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log(
      `Fetching recordings for enrollment: ${enrollmentId}, user: ${userId}`
    );

    let enrollment = null;
    let course = null;

    // Check if this is a user enrollment (starts with "user_")
    if (enrollmentId.startsWith("user_")) {
      console.log("This is a user enrollment from enrolledCourses array");

      // Extract course ID from the enrollment ID
      const courseId = enrollmentId.replace("user_", "");

      // Get user and find the enrollment in enrolledCourses array
      const user = await User.findById(userId).populate(
        "enrolledCourses.course",
        "title thumbnail description category instructor"
      );

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Find the enrollment in user's enrolledCourses array
      const userEnrollment = user.enrolledCourses.find(
        (enrollment) => enrollment.course._id.toString() === courseId
      );

      if (!userEnrollment) {
        console.log("User enrollment not found:", enrollmentId);
        return res.status(404).json({
          status: "error",
          message: "Enrollment not found",
        });
      }

      enrollment = {
        _id: enrollmentId,
        user: userId,
        course: userEnrollment.course,
        enrolledAt: userEnrollment.enrolledAt,
        progress: userEnrollment.progress,
        source: "user_enrolledCourses",
      };
      course = userEnrollment.course;
    } else {
      console.log("This is a regular enrollment from Enrollment collection");

      // Regular enrollment from Enrollment collection
      enrollment = await Enrollment.findById(enrollmentId).populate(
        "course",
        "title thumbnail description category instructor"
      );

      if (!enrollment) {
        console.log("Enrollment not found:", enrollmentId);
        return res.status(404).json({
          status: "error",
          message: "Enrollment not found",
        });
      }

      // Check if the enrollment belongs to the authenticated user
      if (enrollment.user.toString() !== userId) {
        console.log("Enrollment does not belong to user:", {
          enrollmentUser: enrollment.user.toString(),
          authenticatedUser: userId,
        });
        return res.status(403).json({
          status: "error",
          message: "You are not authorized to access this enrollment",
        });
      }

      course = enrollment.course;
    }

    // Check if the course still exists
    if (!course) {
      console.log("Course has been deleted for enrollment:", enrollmentId);
      return res.status(404).json({
        status: "error",
        message: "The course for this enrollment has been deleted",
      });
    }

    console.log(`Found enrollment for course: ${course.title}`);

    // First, let's check all recordings for this course (regardless of status)
    const allRecordings = await LiveClassRecording.find({
      course: course._id,
    }).sort({ date: -1 });

    console.log(
      `Found ${allRecordings.length} total recordings for course ${course._id}`
    );

    // Log all recordings with their status for debugging
    allRecordings.forEach((recording, index) => {
      console.log(`Recording ${index + 1}:`, {
        id: recording._id,
        lectureNumber: recording.lectureNumber,
        status: recording.status,
        hasUrl: !!recording.recordingUrl,
        urlLength: recording.recordingUrl ? recording.recordingUrl.length : 0,
        date: recording.date,
        course: recording.course,
      });
    });

    // Filter for ready and uploaded recordings (uploaded means the file is uploaded and ready to view)
    const recordings = allRecordings.filter(
      (recording) =>
        recording.status === "ready" || recording.status === "uploaded"
    );

    const total = recordings.length;

    console.log(
      `Found ${recordings.length} ready recordings for course ${course._id} (out of ${allRecordings.length} total)`
    );

    res.status(200).json({
      status: "success",
      data: {
        enrollment: {
          _id: enrollment._id,
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          source: enrollment.source || "enrollment_collection",
        },
        course: {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          description: course.description,
          category: course.category,
          instructor: course.instructor,
        },
        recordings: recordings.map((recording) => ({
          _id: recording._id,
          lectureNumber: recording.lectureNumber,
          date: recording.date,
          duration: recording.duration,
          hostedBy: recording.hostedBy,
          description: recording.description,
          recordingUrl: recording.recordingUrl,
          views: recording.views,
          status: recording.status,
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recordings by enrollment:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${error.message}`
          : "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Get recordings for a specific course (for enrolled students)
// @route   GET /api/live-class-recordings/student/course/:courseId
// @access  Private
export const getStudentCourseRecordings = async (req, res) => {
  try {
    // Debug authentication
    console.log("Student course recordings debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      courseId: req.params.courseId,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
    });

    // Check if user is authenticated
    if (!req.user) {
      console.error("Authentication error: req.user is undefined");
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const userId = req.user.id;
    const { courseId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if user is enrolled in this course
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).populate("course", "title thumbnail description category instructor");

    if (!enrollment) {
      return res.status(403).json({
        status: "error",
        message: "You are not enrolled in this course",
      });
    }

    // Get recordings for this course
    const recordings = await LiveClassRecording.find({
      course: courseId,
      status: { $in: ["ready", "uploaded"] },
    })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LiveClassRecording.countDocuments({
      course: courseId,
      status: { $in: ["ready", "uploaded"] },
    });

    res.status(200).json({
      status: "success",
      data: {
        course: {
          _id: enrollment.course._id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail,
          description: enrollment.course.description,
          category: enrollment.course.category,
          instructor: enrollment.course.instructor,
        },
        recordings: recordings.map((recording) => ({
          _id: recording._id,
          lectureNumber: recording.lectureNumber,
          date: recording.date,
          duration: recording.duration,
          hostedBy: recording.hostedBy,
          description: recording.description,
          recordingUrl: recording.recordingUrl,
          views: recording.views,
          status: recording.status,
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching student course recordings:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${error.message}`
          : "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Debug endpoint to check recording URLs
// @route   GET /api/live-class-recordings/debug/:id
// @access  Private/Admin
export const debugRecording = async (req, res) => {
  try {
    const recording = await LiveClassRecording.findById(req.params.id);

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        id: recording._id,
        recordingUrl: recording.recordingUrl,
        fileSize: recording.fileSize,
        hasUrl: !!recording.recordingUrl,
        urlLength: recording.recordingUrl ? recording.recordingUrl.length : 0,
        createdAt: recording.createdAt,
        updatedAt: recording.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error debugging recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Clean up orphaned enrollments (enrollments with deleted courses)
// @route   POST /api/live-class-recordings/cleanup-enrollments
// @access  Private/Admin
export const cleanupOrphanedEnrollments = async (req, res) => {
  try {
    console.log("Starting cleanup of orphaned enrollments...");

    // Find all enrollments
    const allEnrollments = await Enrollment.find({}).populate("course");

    // Find orphaned enrollments (where course is null)
    const orphanedEnrollments = allEnrollments.filter(
      (enrollment) => !enrollment.course
    );

    console.log(
      `Found ${orphanedEnrollments.length} orphaned enrollments out of ${allEnrollments.length} total`
    );

    if (orphanedEnrollments.length > 0) {
      // Delete orphaned enrollments
      const orphanedIds = orphanedEnrollments.map(
        (enrollment) => enrollment._id
      );
      const deleteResult = await Enrollment.deleteMany({
        _id: { $in: orphanedIds },
      });

      console.log(`Deleted ${deleteResult.deletedCount} orphaned enrollments`);

      res.status(200).json({
        status: "success",
        message: `Cleaned up ${deleteResult.deletedCount} orphaned enrollments`,
        data: {
          totalEnrollments: allEnrollments.length,
          orphanedEnrollments: orphanedEnrollments.length,
          deletedCount: deleteResult.deletedCount,
        },
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No orphaned enrollments found",
        data: {
          totalEnrollments: allEnrollments.length,
          orphanedEnrollments: 0,
          deletedCount: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error cleaning up orphaned enrollments:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get user's enrollments with enrollment IDs
// @route   GET /api/live-class-recordings/student/enrollments
// @access  Private
export const getUserEnrollments = async (req, res) => {
  try {
    // Debug authentication
    console.log("User enrollments debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
    });

    // Check if user is authenticated
    if (!req.user) {
      console.error("Authentication error: req.user is undefined");
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const userId = req.user.id;
    console.log(`Fetching enrollments for user: ${userId}`);

    // Get user's enrollments from separate Enrollment collection
    const enrollmentCollection = await Enrollment.find({ user: userId })
      .populate("course", "title thumbnail description category instructor")
      .sort({ enrolledAt: -1 });

    console.log(
      `Found ${enrollmentCollection.length} enrollments from Enrollment collection`
    );

    // Get user's enrollments from User's enrolledCourses array
    const user = await User.findById(userId).populate(
      "enrolledCourses.course",
      "title thumbnail description category instructor"
    );

    console.log(
      `Found ${user.enrolledCourses.length} enrollments from User's enrolledCourses`
    );

    // Combine both enrollment sources
    const allEnrollments = [];

    // Add enrollments from Enrollment collection
    enrollmentCollection.forEach((enrollment) => {
      if (enrollment.course && enrollment.course._id) {
        allEnrollments.push({
          _id: enrollment._id,
          source: "enrollment_collection",
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          course: {
            _id: enrollment.course._id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail,
            description: enrollment.course.description,
            category: enrollment.course.category,
            instructor: enrollment.course.instructor,
          },
        });
      }
    });

    // Add enrollments from User's enrolledCourses array
    user.enrolledCourses.forEach((enrollment) => {
      if (enrollment.course && enrollment.course._id) {
        // Check if this enrollment already exists from the collection
        const exists = allEnrollments.some(
          (existing) =>
            existing.course._id.toString() === enrollment.course._id.toString()
        );

        if (!exists) {
          allEnrollments.push({
            _id: `user_${enrollment.course._id}`, // Generate a unique ID for user enrollments
            source: "user_enrolledCourses",
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            course: {
              _id: enrollment.course._id,
              title: enrollment.course.title,
              thumbnail: enrollment.course.thumbnail,
              description: enrollment.course.description,
              category: enrollment.course.category,
              instructor: enrollment.course.instructor,
            },
          });
        }
      }
    });

    console.log(`Total combined enrollments: ${allEnrollments.length}`);

    res.status(200).json({
      status: "success",
      data: {
        enrollments: allEnrollments,
        totalEnrollments: allEnrollments.length,
        enrollmentSources: {
          fromCollection: enrollmentCollection.length,
          fromUserArray: user.enrolledCourses.length,
          combined: allEnrollments.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${error.message}`
          : "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Test endpoint for student recordings
// @route   GET /api/live-class-recordings/test-student
// @access  Private
export const testStudentRecordings = async (req, res) => {
  try {
    console.log("Test student recordings endpoint called");
    console.log("Authentication debug:", {
      hasUser: !!req.user,
      userId: req.user?.id,
      userRole: req.user?.role,
      headers: req.headers.authorization
        ? "Authorization header present"
        : "No authorization header",
    });

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    // Simple test response
    res.status(200).json({
      status: "success",
      message: "Student recordings endpoint is working",
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in test student recordings:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Debug endpoint to check recordings for a specific course
// @route   GET /api/live-class-recordings/debug-course-recordings/:courseId
// @access  Private
export const debugCourseRecordings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const { courseId } = req.params;
    console.log(`Debug: Checking recordings for course: ${courseId}`);

    // Get all recordings for this course
    const allRecordings = await LiveClassRecording.find({
      course: courseId,
    }).sort({ date: -1 });

    console.log(
      `Found ${allRecordings.length} total recordings for course ${courseId}`
    );

    const debugData = {
      courseId,
      totalRecordings: allRecordings.length,
      recordings: allRecordings.map((recording) => ({
        id: recording._id,
        lectureNumber: recording.lectureNumber,
        status: recording.status,
        hasUrl: !!recording.recordingUrl,
        urlLength: recording.recordingUrl ? recording.recordingUrl.length : 0,
        date: recording.date,
        hostedBy: recording.hostedBy,
        description: recording.description,
        views: recording.views,
        createdAt: recording.createdAt,
        updatedAt: recording.updatedAt,
      })),
      statusCounts: {
        ready: allRecordings.filter((r) => r.status === "ready").length,
        processing: allRecordings.filter((r) => r.status === "processing")
          .length,
        failed: allRecordings.filter((r) => r.status === "failed").length,
        pending: allRecordings.filter((r) => r.status === "pending").length,
        other: allRecordings.filter(
          (r) =>
            !["ready", "processing", "failed", "pending"].includes(r.status)
        ).length,
      },
    };

    res.status(200).json({
      status: "success",
      message: "Debug data for course recordings",
      data: debugData,
    });
  } catch (error) {
    console.error("Error in debug course recordings:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Debug endpoint to check user's enrollment and recordings
// @route   GET /api/live-class-recordings/debug-user-recordings
// @access  Private
export const debugUserRecordings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const userId = req.user.id;
    console.log(`Debug: Checking recordings for user ${userId}`);

    // Get user's enrollments
    const enrollments = await Enrollment.find({ user: userId })
      .populate("course", "title thumbnail description category instructor")
      .sort({ enrolledAt: -1 });

    console.log(`Found ${enrollments.length} enrollments for user ${userId}`);

    const debugData = {
      userId,
      totalEnrollments: enrollments.length,
      enrollments: [],
      allRecordings: [],
      readyRecordings: [],
    };

    // Check each enrollment
    for (const enrollment of enrollments) {
      if (!enrollment.course) {
        console.log(`Enrollment ${enrollment._id} has no course (deleted)`);
        continue;
      }

      console.log(
        `Checking course: ${enrollment.course.title} (${enrollment.course._id})`
      );

      // Get all recordings for this course
      const allRecordings = await LiveClassRecording.find({
        course: enrollment.course._id,
      }).sort({ date: -1 });

      const readyRecordings = allRecordings.filter(
        (recording) =>
          recording.status === "ready" || recording.status === "uploaded"
      );

      console.log(
        `Course ${enrollment.course.title}: ${allRecordings.length} total, ${readyRecordings.length} ready`
      );

      debugData.enrollments.push({
        enrollmentId: enrollment._id,
        courseId: enrollment.course._id,
        courseTitle: enrollment.course.title,
        enrolledAt: enrollment.enrolledAt,
        totalRecordings: allRecordings.length,
        readyRecordings: readyRecordings.length,
        recordings: allRecordings.map((rec) => ({
          id: rec._id,
          lectureNumber: rec.lectureNumber,
          status: rec.status,
          hasUrl: !!rec.recordingUrl,
          urlLength: rec.recordingUrl ? rec.recordingUrl.length : 0,
          date: rec.date,
        })),
      });

      debugData.allRecordings.push(...allRecordings);
      debugData.readyRecordings.push(...readyRecordings);
    }

    res.status(200).json({
      status: "success",
      message: "Debug data for user recordings",
      data: debugData,
    });
  } catch (error) {
    console.error("Error in debug user recordings:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Check for recordings without URLs
// @route   GET /api/live-class-recordings/check-missing-urls
// @access  Private/Admin
export const checkMissingUrls = async (req, res) => {
  try {
    const recordingsWithoutUrls = await LiveClassRecording.find({
      $or: [
        { recordingUrl: { $exists: false } },
        { recordingUrl: null },
        { recordingUrl: "" },
      ],
    }).select("_id lectureNumber course createdAt");

    const totalRecordings = await LiveClassRecording.countDocuments();
    const recordingsWithUrls = totalRecordings - recordingsWithoutUrls.length;

    res.status(200).json({
      status: "success",
      data: {
        totalRecordings,
        recordingsWithUrls,
        recordingsWithoutUrls: recordingsWithoutUrls.length,
        missingUrls: recordingsWithoutUrls,
      },
    });
  } catch (error) {
    console.error("Error checking missing URLs:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get recording statistics
// @route   GET /api/live-class-recordings/stats
// @access  Private/Admin
export const getRecordingStatistics = async (req, res) => {
  try {
    const stats = await LiveClassRecording.getStatistics();
    const totalRecordings = stats[0]?.totalRecordings || 0;
    const totalViews = stats[0]?.totalViews || 0;
    const totalFileSize = stats[0]?.totalFileSize || 0;
    const averageViews = stats[0]?.averageViews || 0;

    // Get recent recordings
    const recentRecordings = await LiveClassRecording.find()
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recordings by course
    const recordingsByCourse = await LiveClassRecording.aggregate([
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          courseTitle: "$course.title",
          count: 1,
          totalViews: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalRecordings,
        totalViews,
        totalFileSize,
        averageViews: Math.round(averageViews * 10) / 10,
        recentRecordings,
        recordingsByCourse,
      },
    });
  } catch (error) {
    console.error("Error fetching recording statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get enrolled users for a specific recording
// @route   GET /api/live-class-recordings/:id/enrolled-users
// @access  Private/Admin
export const getEnrolledUsersForRecording = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log(`Fetching enrolled users for recording: ${id}`);

    // Get the recording first to get the course ID
    const recording = await LiveClassRecording.findById(id).populate(
      "course",
      "title"
    );

    if (!recording) {
      return res.status(404).json({
        status: "error",
        message: "Recording not found",
      });
    }

    console.log(`Found recording for course: ${recording.course.title}`);

    // Get enrolled users for this course
    const enrolledUsers = await LiveClassRecording.getEnrolledUsersByCourse(
      recording.course._id
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = enrolledUsers.slice(startIndex, endIndex);

    console.log(
      `Found ${enrolledUsers.length} enrolled users for course ${recording.course._id}`
    );

    res.status(200).json({
      status: "success",
      data: {
        recording: {
          _id: recording._id,
          lectureNumber: recording.lectureNumber,
          course: {
            _id: recording.course._id,
            title: recording.course.title,
          },
        },
        enrolledUsers: paginatedUsers.map((enrollment) => ({
          _id: enrollment._id,
          user: {
            _id: enrollment.user._id,
            firstName: enrollment.user.firstName,
            lastName: enrollment.user.lastName,
            email: enrollment.user.email,
            profilePicture: enrollment.user.profilePicture,
          },
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          status: enrollment.status,
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(enrolledUsers.length / limit),
          total: enrolledUsers.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching enrolled users for recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc    Get enrolled users for a course (by course ID)
// @route   GET /api/live-class-recordings/course/:courseId/enrolled-users
// @access  Private/Admin
export const getEnrolledUsersForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log(`Fetching enrolled users for course: ${courseId}`);

    // Check if course exists
    const course = await Course.findById(courseId).select("title");
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Get enrolled users for this course
    const enrolledUsers = await LiveClassRecording.getEnrolledUsersByCourse(
      courseId
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = enrolledUsers.slice(startIndex, endIndex);

    console.log(
      `Found ${enrolledUsers.length} enrolled users for course ${courseId}`
    );

    res.status(200).json({
      status: "success",
      data: {
        course: {
          _id: course._id,
          title: course.title,
        },
        enrolledUsers: paginatedUsers.map((enrollment) => ({
          _id: enrollment._id,
          user: {
            _id: enrollment.user._id,
            firstName: enrollment.user.firstName,
            lastName: enrollment.user.lastName,
            email: enrollment.user.email,
            profilePicture: enrollment.user.profilePicture,
          },
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          status: enrollment.status,
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(enrolledUsers.length / limit),
          total: enrolledUsers.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching enrolled users for course:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};
