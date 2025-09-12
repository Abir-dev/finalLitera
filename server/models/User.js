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
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      completedLessons: [{
        type: mongoose.Schema.Types.ObjectId
      }],
      lastAccessed: {
        type: Date,
        default: Date.now
      },
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
    progress: 0,
    completedLessons: [],
    lastAccessed: new Date()
  });
  
  return this.save();
};

// Update course progress
userSchema.methods.updateCourseProgress = async function (courseId, progress, lessonId) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    throw new Error('User is not enrolled in this course');
  }
  
  enrollment.progress = progress;
  enrollment.lastAccessed = new Date();
  
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
  
  return enrollment ? enrollment.progress : 0;
};

// Issue certificate
userSchema.methods.issueCertificate = async function (courseId, certificateUrl) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    throw new Error('User is not enrolled in this course');
  }
  
  if (enrollment.progress < 100) {
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

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'enrolledCourses.course': 1 });
userSchema.index({ 'subscription.plan': 1 });

export default mongoose.model("User", userSchema);
