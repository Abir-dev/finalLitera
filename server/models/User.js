import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['student', 'instructor', 'admin'], 
      default: "student" 
    },
    avatar: { 
      type: String,
      default: null
    },
    avatarFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null
    },
    isActive: { type: Boolean, default: true },
    profile: {
      bio: { type: String, maxlength: 500 },
      socialLinks: {
        website: String,
        linkedin: String,
        twitter: String,
        github: String
      },
      skills: [String],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
      }]
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        courseUpdates: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
      },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' }
    },
    subscription: {
      plan: { 
        type: String, 
        enum: ['free', 'basic', 'premium', 'enterprise'], 
        default: 'free' 
      },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true }
    },
    enrolledCourses: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      progress: {
        completedVideos: {
          type: Number,
          default: 0,
          min: 0
        },
        totalVideos: {
          type: Number,
          default: 0,
          min: 0
        },
        watchedTime: {
          type: String,
          default: "0:00:00"
        },
        lastAccessed: {
          type: Date,
          default: Date.now
        }
      },
      completedLessons: [{
        type: mongoose.Schema.Types.ObjectId
      }],
      certificateIssued: {
        type: Boolean,
        default: false
      },
      certificateUrl: String
    }],
    certificates: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      issuedAt: {
        type: Date,
        default: Date.now
      },
      certificateUrl: String,
      verificationCode: String
    }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is enrolled in a course
userSchema.methods.isEnrolledInCourse = function (courseId) {
  return this.enrolledCourses.some(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
};

// Enroll user in a course
userSchema.methods.enrollInCourse = async function (courseId) {
  if (this.isEnrolledInCourse(courseId)) {
    throw new Error('User is already enrolled in this course');
  }
  
  this.enrolledCourses.push({
    course: courseId,
    enrolledAt: new Date(),
    progress: {
      completedVideos: 0,
      totalVideos: 0,
      watchedTime: "0:00:00",
      lastAccessed: new Date()
    },
    completedLessons: []
  });
  
  return this.save();
};

// Update course progress
userSchema.methods.updateCourseProgress = async function (courseId, progressData, lessonId) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    throw new Error('User is not enrolled in this course');
  }
  
  // Update progress data
  if (progressData.completedVideos !== undefined) {
    enrollment.progress.completedVideos = progressData.completedVideos;
  }
  if (progressData.totalVideos !== undefined) {
    enrollment.progress.totalVideos = progressData.totalVideos;
  }
  if (progressData.watchedTime !== undefined) {
    enrollment.progress.watchedTime = progressData.watchedTime;
  }
  enrollment.progress.lastAccessed = new Date();
  
  if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }
  
  return this.save();
};

// Get course progress
userSchema.methods.getCourseProgress = function (courseId) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    return {
      completedVideos: 0,
      totalVideos: 0,
      watchedTime: "0:00:00",
      lastAccessed: null
    };
  }
  
  return enrollment.progress;
};

// Issue certificate
userSchema.methods.issueCertificate = async function (courseId, certificateUrl) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    throw new Error('User is not enrolled in this course');
  }
  
  const progressPercentage = enrollment.progress.totalVideos > 0 
    ? (enrollment.progress.completedVideos / enrollment.progress.totalVideos) * 100 
    : 0;
    
  if (progressPercentage < 100) {
    throw new Error('Course must be completed to issue certificate');
  }
  
  enrollment.certificateIssued = true;
  enrollment.certificateUrl = certificateUrl;
  
  // Add to certificates array
  this.certificates.push({
    course: courseId,
    issuedAt: new Date(),
    certificateUrl,
    verificationCode: this._id.toString().slice(-8) + Date.now().toString().slice(-8)
  });
  
  return this.save();
};

// --- Referral fields and helpers ---
userSchema.add({
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referral: {
    totalInvites: { type: Number, default: 0 },
    successfulPurchases: { type: Number, default: 0 },
    totalCoinsEarned: { type: Number, default: 0 },
  },
  referralDiscountUsed: { type: Boolean, default: false }, // whether 10% referral discount was used by referred user
  referralRewardGiven: { type: Boolean, default: false }, // first-purchase reward credited to referrer
});

// Generate a short referral code from user id if missing
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    const idPart = this._id ? String(this._id).slice(-6) : Math.random().toString(36).slice(2, 8);
    this.referralCode = `LIT${idPart}`.toUpperCase();
  }
  next();
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'enrolledCourses.course': 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ referralCode: 1 });

export default mongoose.model("User", userSchema);
