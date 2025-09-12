import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const createUploadDirs = () => {
  const uploadDirs = [
    path.join(__dirname, '../uploads/images'),
    path.join(__dirname, '../uploads/videos'),
    path.join(__dirname, '../uploads/documents'),
    path.join(__dirname, '../uploads/thumbnails'),
    path.join(__dirname, '../uploads/avatars')
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  const fileType = file.mimetype;
  
  if (allowedImageTypes.includes(fileType)) {
    cb(null, true);
  } else if (allowedVideoTypes.includes(fileType)) {
    cb(null, true);
  } else if (allowedDocTypes.includes(fileType)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileType} is not allowed`), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../uploads');
    
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(uploadPath, 'avatars');
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = path.join(uploadPath, 'thumbnails');
    } else if (file.fieldname === 'video') {
      uploadPath = path.join(uploadPath, 'videos');
    } else if (file.fieldname === 'document') {
      uploadPath = path.join(uploadPath, 'documents');
    } else {
      uploadPath = path.join(uploadPath, 'images');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Specific upload middlewares for different file types
export const uploadAvatar = upload.single('avatar');
export const uploadThumbnail = upload.single('thumbnail');
export const uploadVideo = upload.single('video');
export const uploadDocument = upload.single('document');
export const uploadImages = upload.array('images', 5);
export const uploadMultiple = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size allowed is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum 5 files allowed per request.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  
  next(error);
};

// File validation helper
export const validateFile = (file, allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    return { valid: false, error: `File type ${file.mimetype} is not allowed` };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` };
  }
  
  return { valid: true };
};

// Clean up temporary files
export const cleanupTempFiles = (files) => {
  if (!files) return;
  
  const fileArray = Array.isArray(files) ? files : [files];
  
  fileArray.forEach(file => {
    if (file && file.path) {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }
  });
};

export default upload;
