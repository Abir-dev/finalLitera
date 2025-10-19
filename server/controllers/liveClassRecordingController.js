import LiveClassRecording from "../models/LiveClassRecording.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
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

// @desc    Get live class recording by ID
// @route   GET /api/live-class-recordings/:id
// @access  Private/Admin
export const getLiveClassRecordingById = async (req, res) => {
  try {
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

    res.status(200).json({
      status: "success",
      data: { recording },
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
        const uploadResult = await uploadToR2(req.file, "lms-king/videos", {
          metadata: {
            originalName: req.file.originalname,
            fieldname: req.file.fieldname,
            type: "video",
          },
        });

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
      uploadedBy: req.user.id,
    };

    const recording = await LiveClassRecording.create(recordingData);

    // Populate the created recording
    await recording.populate([
      { path: "course", select: "title" },
      { path: "uploadedBy", select: "firstName lastName" },
    ]);

    res.status(201).json({
      status: "success",
      message: "Recording uploaded successfully",
      data: { recording },
    });
  } catch (error) {
    console.error("Error creating recording:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
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
    const { page = 1, limit = 10 } = req.query;

    const recordings = await LiveClassRecording.findByCourse(courseId)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LiveClassRecording.countDocuments({ course: courseId });

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
    const userId = req.user.id;

    // Get user's enrolled courses
    const enrollments = await Enrollment.find({ user: userId })
      .populate("course", "title thumbnail description category instructor")
      .sort({ enrolledAt: -1 });

    if (enrollments.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          courses: [],
          message: "No enrolled courses found",
        },
      });
    }

    // Get course IDs
    const courseIds = enrollments.map((enrollment) => enrollment.course._id);

    // Get recordings for enrolled courses grouped by course
    const coursesWithRecordings = await Promise.all(
      enrollments.map(async (enrollment) => {
        const recordings = await LiveClassRecording.find({
          course: enrollment.course._id,
          status: "ready",
        })
          .sort({ date: -1 })
          .limit(10); // Limit to recent 10 recordings per course

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

    // Filter out courses with no recordings
    const coursesWithRecordingsOnly = coursesWithRecordings.filter(
      (course) => course.recordings.length > 0
    );

    res.status(200).json({
      status: "success",
      data: {
        courses: coursesWithRecordingsOnly,
        totalCourses: coursesWithRecordingsOnly.length,
      },
    });
  } catch (error) {
    console.error("Error fetching student recordings:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Get recordings for a specific course (for enrolled students)
// @route   GET /api/live-class-recordings/student/course/:courseId
// @access  Private
export const getStudentCourseRecordings = async (req, res) => {
  try {
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
      status: "ready",
    })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LiveClassRecording.countDocuments({
      course: courseId,
      status: "ready",
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
