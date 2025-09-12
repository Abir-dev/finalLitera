import express from 'express';
import {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadAvatar,
  uploadThumbnail,
  uploadVideo,
  uploadDocument,
  deleteFile,
  getFileInfo,
  getOptimizedImage,
  listFiles,
  updateFileMetadata,
  generateThumbnail,
  getUploadStats
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  uploadAvatar as uploadAvatarMiddleware,
  uploadThumbnail as uploadThumbnailMiddleware,
  uploadVideo as uploadVideoMiddleware,
  uploadDocument as uploadDocumentMiddleware,
  uploadImages,
  uploadMultiple,
  handleUploadError
} from '../middleware/upload.js';

const router = express.Router();

// @desc    Upload single file (general purpose)
// @route   POST /api/upload/single
// @access  Private
router.post('/single', protect, uploadMultiple, handleUploadError, uploadSingleFile);

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, uploadImages, handleUploadError, uploadMultipleFiles);

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, uploadAvatarMiddleware, handleUploadError, uploadAvatar);

// @desc    Upload course thumbnail
// @route   POST /api/upload/thumbnail
// @access  Private/Admin
router.post('/thumbnail', protect, authorize('admin'), uploadThumbnailMiddleware, handleUploadError, uploadThumbnail);

// @desc    Upload course video
// @route   POST /api/upload/video
// @access  Private/Admin
router.post('/video', protect, authorize('admin'), uploadVideoMiddleware, handleUploadError, uploadVideo);

// @desc    Upload document
// @route   POST /api/upload/document
// @access  Private
router.post('/document', protect, uploadDocumentMiddleware, handleUploadError, uploadDocument);

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
router.delete('/:publicId', protect, deleteFile);

// @desc    Get file information
// @route   GET /api/upload/:publicId/info
// @access  Private
router.get('/:publicId/info', protect, getFileInfo);

// @desc    Get optimized image URL
// @route   GET /api/upload/:publicId/optimized
// @access  Public
router.get('/:publicId/optimized', getOptimizedImage);

// @desc    List files in a folder
// @route   GET /api/upload/list/:folder
// @access  Private
router.get('/list/:folder', protect, listFiles);

// @desc    Update file metadata
// @route   PUT /api/upload/:publicId
// @access  Private
router.put('/:publicId', protect, updateFileMetadata);

// @desc    Generate video thumbnail
// @route   POST /api/upload/:publicId/thumbnail
// @access  Private/Admin
router.post('/:publicId/thumbnail', protect, authorize('admin'), generateThumbnail);

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getUploadStats);

export default router;
