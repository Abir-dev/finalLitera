import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [200, 'Exam title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Quiz', 'Exam', 'Final Exam', 'Project'],
    default: 'Quiz'
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: [1, 'Total questions must be at least 1']
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  attempts: {
    type: Number,
    default: 0
  },
  avgScore: {
    type: Number,
    default: 0
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  examUrl: {
    type: String,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

examSchema.virtual('isUpcoming').get(function() {
  if (!this.scheduledDate) return false;
  return this.scheduledDate.getTime() > Date.now();
});

examSchema.virtual('isActiveNow').get(function() {
  if (!this.scheduledDate) return false;
  return this.status === 'active' && this.scheduledDate.getTime() <= Date.now();
});

examSchema.index({ title: 'text', description: 'text', course: 'text' });
examSchema.index({ status: 1, scheduledDate: 1, visibility: 1, createdAt: -1 });

export default mongoose.model('Exam', examSchema);


