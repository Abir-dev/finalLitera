import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'dropped'],
    default: 'active'
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: String,
  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: String,
    transactionId: String,
    paidAt: Date
  },
  notes: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure one enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Indexes for better query performance
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ progress: -1 });
enrollmentSchema.index({ status: 1 });

export default mongoose.model('Enrollment', enrollmentSchema);
