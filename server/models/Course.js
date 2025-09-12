import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: String,
  videoFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'document']
    }
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: {
      type: Number,
      default: 70
    }
  }
}, {
  timestamps: true
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    // required: [true, 'Category is required'],
    enum: [
      'programming',
      'data-science',
      'web-development',
      'mobile-development',
      'design',
      'business',
      'marketing',
      'photography',
      'music',
      'language',
      'other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Course duration is required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['USD', 'INR', 'EUR', 'GBP']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  thumbnailFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  images: [String],
  videos: [String],
  modules: [moduleSchema],
  tags: [String],
  requirements: [String],
  learningOutcomes: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isLaunchPad: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  enrollmentCount: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  certificate: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    template: String,
    requirements: {
      minProgress: {
        type: Number,
        default: 100
      },
      minQuizScore: {
        type: Number,
        default: 70
      }
    }
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    isSelfPaced: {
      type: Boolean,
      default: true
    },
    liveSessions: [{
      title: String,
      date: Date,
      duration: Number,
      meetingLink: String,
      recordingUrl: String
    }]
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    enrollments: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  return this.modules.reduce((total, module) => total + module.lessons.length, 0);
});

// Virtual for total duration in minutes
courseSchema.virtual('totalDurationMinutes').get(function() {
  return this.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + (lesson.duration || 0);
    }, 0);
  }, 0);
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1, isFeatured: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });

// Update rating when review is added
courseSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  return this.save();
};

// Add review
courseSchema.methods.addReview = function(userId, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  
  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      rating,
      comment
    });
  }
  
  return this.updateRating();
};

// Increment enrollment count
courseSchema.methods.incrementEnrollment = function() {
  this.enrollmentCount += 1;
  this.analytics.enrollments += 1;
  return this.save();
};

// Increment completion count
courseSchema.methods.incrementCompletion = function() {
  this.analytics.completions += 1;
  this.completionRate = this.analytics.completions / this.enrollmentCount * 100;
  return this.save();
};

export default mongoose.model('Course', courseSchema);
