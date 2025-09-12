import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: [true, 'Public ID is required'],
    unique: true
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  format: {
    type: String,
    required: [true, 'File format is required']
  },
  width: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  duration: {
    type: Number,
    default: null // For videos
  },
  folder: {
    type: String,
    required: [true, 'Folder is required'],
    enum: ['avatars', 'thumbnails', 'videos', 'documents', 'images']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  tags: [String],
  context: {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    alt: String,
    caption: String,
    description: String,
    copyright: String,
    location: String
  },
  transformations: [{
    name: String,
    width: Number,
    height: Number,
    crop: String,
    quality: String,
    format: String,
    url: String
  }],
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file type
fileSchema.virtual('fileType').get(function() {
  if (this.mimeType.startsWith('image/')) return 'image';
  if (this.mimeType.startsWith('video/')) return 'video';
  if (this.mimeType.startsWith('audio/')) return 'audio';
  if (this.mimeType.includes('pdf') || this.mimeType.includes('document')) return 'document';
  return 'other';
});

// Virtual for file size in human readable format
fileSchema.virtual('sizeFormatted').get(function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for duration in human readable format (for videos)
fileSchema.virtual('durationFormatted').get(function() {
  if (!this.duration) return null;
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = Math.floor(this.duration % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Indexes for better query performance
fileSchema.index({ publicId: 1 });
fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ folder: 1 });
fileSchema.index({ mimeType: 1 });
fileSchema.index({ 'context.course': 1 });
fileSchema.index({ 'context.lesson': 1 });
fileSchema.index({ isActive: 1 });
fileSchema.index({ createdAt: -1 });

// Static method to get files by folder
fileSchema.statics.getFilesByFolder = function(folder, options = {}) {
  const query = { folder, isActive: true };
  if (options.uploadedBy) query.uploadedBy = options.uploadedBy;
  if (options.mimeType) query.mimeType = options.mimeType;
  
  return this.find(query)
    .populate('uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Static method to get file statistics
fileSchema.statics.getFileStats = function(userId = null) {
  const match = { isActive: true };
  if (userId) match.uploadedBy = userId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$size' },
        filesByType: {
          $push: {
            $cond: [
              { $regexMatch: { input: '$mimeType', regex: /^image\// } },
              'image',
              {
                $cond: [
                  { $regexMatch: { input: '$mimeType', regex: /^video\// } },
                  'video',
                  {
                    $cond: [
                      { $regexMatch: { input: '$mimeType', regex: /^audio\// } },
                      'audio',
                      'document'
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    },
    {
      $project: {
        totalFiles: 1,
        totalSize: 1,
        filesByType: {
          $reduce: {
            input: '$filesByType',
            initialValue: { image: 0, video: 0, audio: 0, document: 0 },
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{ k: '$$this', v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] } }]
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]);
};

// Instance method to increment view count
fileSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastAccessed = new Date();
  return this.save();
};

// Instance method to increment download count
fileSchema.methods.incrementDownloads = function() {
  this.analytics.downloads += 1;
  this.analytics.lastAccessed = new Date();
  return this.save();
};

// Instance method to add transformation
fileSchema.methods.addTransformation = function(transformation) {
  this.transformations.push(transformation);
  return this.save();
};

// Instance method to soft delete
fileSchema.methods.softDelete = function() {
  this.isActive = false;
  return this.save();
};

export default mongoose.model('File', fileSchema);
