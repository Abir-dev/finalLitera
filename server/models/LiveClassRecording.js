import mongoose from "mongoose";

const liveClassRecordingSchema = new mongoose.Schema(
  {
    lectureNumber: {
      type: String,
      required: [true, "Lecture number is required"],
      trim: true,
      maxlength: [100, "Lecture number cannot exceed 100 characters"],
    },
    date: {
      type: Date,
      required: [true, "Recording date is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },
    hostedBy: {
      type: String,
      required: [true, "Host name is required"],
      trim: true,
      maxlength: [200, "Host name cannot exceed 200 characters"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    recordingUrl: {
      type: String,
      required: [true, "Recording URL is required"],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Uploader is required"],
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "ready", "failed"],
      default: "uploaded",
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted file size
liveClassRecordingSchema.virtual("formattedFileSize").get(function () {
  if (this.fileSize === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(k));
  return (
    parseFloat((this.fileSize / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
});

// Virtual for formatted duration
liveClassRecordingSchema.virtual("formattedDuration").get(function () {
  // Convert duration string to readable format
  const duration = this.duration;
  if (!duration) return "Unknown";

  // Handle different duration formats
  if (duration.includes(":")) {
    const parts = duration.split(":");
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return `${minutes}m ${seconds}s`;
    }
  }

  return duration;
});

// Virtual to get enrolled users for this course
liveClassRecordingSchema.virtual("enrolledUsers", {
  ref: "Enrollment",
  localField: "course",
  foreignField: "course",
  justOne: false,
  options: {
    populate: {
      path: "user",
      select: "firstName lastName email profilePicture",
    },
  },
});

// Method to increment views
liveClassRecordingSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to find recordings by course
liveClassRecordingSchema.statics.findByCourse = function (courseId) {
  return this.find({ course: courseId })
    .populate("course", "title")
    .populate("uploadedBy", "firstName lastName")
    .sort({ date: -1 });
};

// Static method to find recordings by date range
liveClassRecordingSchema.statics.findByDateRange = function (
  startDate,
  endDate
) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("course", "title")
    .populate("uploadedBy", "firstName lastName")
    .sort({ date: -1 });
};

// Static method to get recording statistics
liveClassRecordingSchema.statics.getStatistics = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalRecordings: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalFileSize: { $sum: "$fileSize" },
        averageViews: { $avg: "$views" },
      },
    },
  ]);
};

// Static method to get enrolled users for a specific recording
liveClassRecordingSchema.statics.getEnrolledUsers = async function (
  recordingId
) {
  const recording = await this.findById(recordingId).populate({
    path: "enrolledUsers",
    populate: {
      path: "user",
      select: "firstName lastName email profilePicture",
    },
  });

  if (!recording) {
    throw new Error("Recording not found");
  }

  return recording.enrolledUsers;
};

// Static method to get enrolled users for a course (by course ID)
liveClassRecordingSchema.statics.getEnrolledUsersByCourse = async function (
  courseId
) {
  const Enrollment = mongoose.model("Enrollment");

  return await Enrollment.find({ course: courseId })
    .populate("user", "firstName lastName email profilePicture")
    .select("user enrolledAt progress status");
};

// Indexes for better query performance
liveClassRecordingSchema.index({ course: 1, date: -1 });
liveClassRecordingSchema.index({ uploadedBy: 1 });
liveClassRecordingSchema.index({ date: -1 });
liveClassRecordingSchema.index({ status: 1 });
liveClassRecordingSchema.index({ isPublic: 1 });
liveClassRecordingSchema.index({ createdAt: -1 });

// Pre-save middleware to validate date
liveClassRecordingSchema.pre("save", function (next) {
  // Validate that date is not in the future
  if (this.date > new Date()) {
    return next(new Error("Recording date cannot be in the future"));
  }

  // Validate start and end time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(this.startTime) || !timeRegex.test(this.endTime)) {
    return next(new Error("Invalid time format. Use HH:MM format"));
  }

  next();
});

export default mongoose.model("LiveClassRecording", liveClassRecordingSchema);
