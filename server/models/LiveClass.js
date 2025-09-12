import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      maxlength: [200, "Class name cannot exceed 200 characters"],
    },
    classTiming: {
      startTime: {
        type: Date,
        required: [true, "Class start time is required"],
      },
      endTime: {
        type: Date,
        required: [true, "Class end time is required"],
      },
      timezone: {
        type: String,
        default: "UTC",
        enum: [
          "UTC",
          "Asia/Kolkata",
          "America/New_York",
          "America/Los_Angeles",
          "Europe/London",
          "Europe/Paris",
          "Asia/Tokyo",
          "Australia/Sydney",
        ],
      },
    },
    gmeetLink: {
      type: String,
      required: [true, "Google Meet link is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Basic URL validation for Google Meet links
          return /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i.test(v);
        },
        message: "Please provide a valid Google Meet link",
      },
    },
    isLiveNow: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      enum: [
        "programming",
        "data-science",
        "web-development",
        "mobile-development",
        "design",
        "business",
        "marketing",
        "photography",
        "music",
        "language",
        "other",
      ],
      default: "other",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, "Maximum participants must be at least 1"],
      max: [1000, "Maximum participants cannot exceed 1000"],
    },
    enrolledStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        attendanceStatus: {
          type: String,
          enum: ["enrolled", "attended", "absent"],
          default: "enrolled",
        },
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["pdf", "video", "link", "document", "presentation"],
        },
      },
    ],
    chatHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        messageType: {
          type: String,
          enum: ["text", "question", "answer"],
          default: "text",
        },
      },
    ],
    analytics: {
      totalEnrollments: {
        type: Number,
        default: 0,
      },
      totalAttendance: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
      daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
      endDate: Date,
    },
    parentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveClass",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for enrollment count
liveClassSchema.virtual("enrollmentCount").get(function () {
  return this.enrolledStudents.length;
});

// Virtual for attendance rate
liveClassSchema.virtual("attendanceRate").get(function () {
  if (this.enrolledStudents.length === 0) return 0;
  const attendedCount = this.enrolledStudents.filter(
    (enrollment) => enrollment.attendanceStatus === "attended"
  ).length;
  return Math.round((attendedCount / this.enrolledStudents.length) * 100);
});

// Virtual for class duration in minutes
liveClassSchema.virtual("durationMinutes").get(function () {
  if (!this.classTiming.startTime || !this.classTiming.endTime) return 0;
  return Math.round(
    (this.classTiming.endTime - this.classTiming.startTime) / (1000 * 60)
  );
});

// Method to check if class is currently live
liveClassSchema.methods.checkIfLive = function () {
  const now = new Date();
  const startTime = new Date(this.classTiming.startTime);
  const endTime = new Date(this.classTiming.endTime);

  // Add buffer time (5 minutes before start)
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  const adjustedStartTime = new Date(startTime.getTime() - bufferTime);

  return now >= adjustedStartTime && now <= endTime;
};

// Method to update live status
liveClassSchema.methods.updateLiveStatus = function () {
  const isLive = this.checkIfLive();
  this.isLiveNow = isLive;

  // Update status based on timing
  const now = new Date();
  const startTime = new Date(this.classTiming.startTime);
  const endTime = new Date(this.classTiming.endTime);

  if (now < startTime) {
    this.status = "scheduled";
  } else if (now >= startTime && now <= endTime) {
    this.status = "live";
  } else if (now > endTime) {
    this.status = "completed";
  }

  return this.save();
};

// Method to enroll student
liveClassSchema.methods.enrollStudent = function (studentId) {
  // Check if student is already enrolled
  const existingEnrollment = this.enrolledStudents.find(
    (enrollment) => enrollment.student.toString() === studentId.toString()
  );

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this class");
  }

  // Check if class is full
  if (this.enrolledStudents.length >= this.maxParticipants) {
    throw new Error("Class is full, cannot enroll more students");
  }

  // Check if class has already started
  const now = new Date();
  if (now >= this.classTiming.startTime) {
    throw new Error("Cannot enroll in a class that has already started");
  }

  this.enrolledStudents.push({
    student: studentId,
    enrolledAt: new Date(),
    attendanceStatus: "enrolled",
  });

  this.analytics.totalEnrollments += 1;
  return this.save();
};

// Method to mark attendance
liveClassSchema.methods.markAttendance = function (studentId, status) {
  const enrollment = this.enrolledStudents.find(
    (enrollment) => enrollment.student.toString() === studentId.toString()
  );

  if (!enrollment) {
    throw new Error("Student is not enrolled in this class");
  }

  enrollment.attendanceStatus = status;

  if (status === "attended") {
    this.analytics.totalAttendance += 1;
  }

  return this.save();
};

// Method to add chat message
liveClassSchema.methods.addChatMessage = function (
  userId,
  message,
  messageType = "text"
) {
  this.chatHistory.push({
    user: userId,
    message,
    messageType,
    timestamp: new Date(),
  });

  return this.save();
};

// Method to add rating
liveClassSchema.methods.addRating = function (rating) {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const totalRatings = this.analytics.totalRatings;
  const currentAverage = this.analytics.averageRating;

  // Calculate new average
  const newTotal = currentAverage * totalRatings + rating;
  const newAverage = newTotal / (totalRatings + 1);

  this.analytics.averageRating = Math.round(newAverage * 10) / 10;
  this.analytics.totalRatings += 1;

  return this.save();
};

// Static method to find live classes
liveClassSchema.statics.findLiveClasses = function () {
  const now = new Date();
  return this.find({
    "classTiming.startTime": { $lte: now },
    "classTiming.endTime": { $gte: now },
    status: { $in: ["scheduled", "live"] },
  });
};

// Static method to find upcoming classes
liveClassSchema.statics.findUpcomingClasses = function (limit = 10) {
  const now = new Date();
  return this.find({
    "classTiming.startTime": { $gt: now },
    status: "scheduled",
  })
    .sort({ "classTiming.startTime": 1 })
    .limit(limit);
};

// Pre-save middleware to validate timing
liveClassSchema.pre("save", function (next) {
  if (this.classTiming.startTime >= this.classTiming.endTime) {
    return next(new Error("Class start time must be before end time"));
  }

  // Update live status before saving
  this.updateLiveStatus();
  next();
});

// Indexes for better query performance
liveClassSchema.index({ "classTiming.startTime": 1, "classTiming.endTime": 1 });
liveClassSchema.index({ status: 1 });
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ category: 1, level: 1 });
liveClassSchema.index({ isLiveNow: 1 });
liveClassSchema.index({ "enrolledStudents.student": 1 });
liveClassSchema.index({ createdAt: -1 });

export default mongoose.model("LiveClass", liveClassSchema);
