import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    lastName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      default: "admin",
      enum: ["admin", "superadmin"]
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
    isActive: { 
      type: Boolean, 
      default: true 
    },
    permissions: {
      userManagement: { type: Boolean, default: true },
      courseManagement: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      settings: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true }
    },
    profile: {
      bio: { type: String, maxlength: 500 },
      phone: { type: String },
      department: { type: String },
      position: { type: String }
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        systemAlerts: { type: Boolean, default: true }
      },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      dashboardLayout: { type: String, default: 'default' }
    },
    lastLogin: {
      type: Date,
      default: null
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
adminSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts on successful login
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Check if admin has specific permission
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true;
};

// Get admin's full name
adminSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Indexes for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ lastLogin: -1 });

export default mongoose.model("Admin", adminSchema);
