import {
  uploadToR2,
  deleteFromR2,
  getR2Info,
  getOptimizedImageUrl,
  generateVideoThumbnail,
} from "../utils/r2.js";
import { cleanupTempFiles, validateFile } from "../middleware/upload.js";
import fs from "fs";
import path from "path";

// @desc    Upload single file to R2
// @route   POST /api/upload/single
// @access  Private
export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file provided",
      });
    }

    const file = req.file;
    const { folder, options } = req.body;

    // Determine folder based on file type
    let uploadFolder = folder || "lms-king";
    if (file.fieldname === "avatar") {
      uploadFolder = "lms-king/avatars";
    } else if (file.fieldname === "thumbnail") {
      uploadFolder = "lms-king/thumbnails";
    } else if (file.fieldname === "video") {
      uploadFolder = "lms-king/videos";
    } else if (file.fieldname === "document") {
      uploadFolder = "lms-king/documents";
    } else {
      uploadFolder = "lms-king/images";
    }

    // Upload to R2
    const uploadOptions = {
      metadata: {
        originalName: file.originalname,
        fieldname: file.fieldname,
        ...(options ? JSON.parse(options) : {}),
      },
    };

    const result = await uploadToR2(file, uploadFolder, uploadOptions);

    if (!result.success) {
      cleanupTempFiles(file);
      return res.status(500).json({
        status: "error",
        message: "Upload failed",
        error: result.error,
      });
    }

    // Clean up temporary file
    cleanupTempFiles(file);

    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      data: {
        file: {
          id: result.data.public_id,
          key: result.data.key,
          url: result.data.secure_url,
          format: result.data.format,
          size: result.data.bytes,
          width: result.data.width,
          height: result.data.height,
          created_at: result.data.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Upload single file error:", error);
    cleanupTempFiles(req.file);
    res.status(500).json({
      status: "error",
      message: "Server error during file upload",
    });
  }
};

// @desc    Upload multiple files to R2
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No files provided",
      });
    }

    const { folder } = req.body;
    const uploadFolder = folder || "lms-king/images";
    const uploadResults = [];
    const errors = [];

    // Upload files in parallel
    const uploadPromises = files.map(async (file) => {
      try {
        const result = await uploadToR2(file, uploadFolder);

        if (result.success) {
          uploadResults.push({
            originalName: file.originalname,
            id: result.data.public_id,
            key: result.data.key,
            url: result.data.secure_url,
            format: result.data.format,
            size: result.data.bytes,
            width: result.data.width,
            height: result.data.height,
          });
        } else {
          errors.push({
            originalName: file.originalname,
            error: result.error,
          });
        }
      } catch (error) {
        errors.push({
          originalName: file.originalname,
          error: error.message,
        });
      }
    });

    await Promise.all(uploadPromises);

    // Clean up temporary files
    cleanupTempFiles(files);

    res.status(200).json({
      status: "success",
      message: `${uploadResults.length} files uploaded successfully`,
      data: {
        uploaded: uploadResults,
        errors: errors,
      },
    });
  } catch (error) {
    console.error("Upload multiple files error:", error);
    cleanupTempFiles(req.files);
    res.status(500).json({
      status: "error",
      message: "Server error during file upload",
    });
  }
};

// @desc    Upload avatar image
// @route   POST /api/upload/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No avatar file provided",
      });
    }

    const file = req.file;

    // Validate file type for avatar
    const validation = validateFile(
      file,
      ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      5 * 1024 * 1024
    );
    if (!validation.valid) {
      cleanupTempFiles(file);
      return res.status(400).json({
        status: "error",
        message: validation.error,
      });
    }

    // Upload to R2 with avatar-specific options
    const result = await uploadToR2(file, "lms-king/avatars", {
      metadata: {
        originalName: file.originalname,
        fieldname: file.fieldname,
        type: "avatar",
      },
    });

    if (!result.success) {
      cleanupTempFiles(file);
      return res.status(500).json({
        status: "error",
        message: "Avatar upload failed",
        error: result.error,
      });
    }

    cleanupTempFiles(file);

    res.status(200).json({
      status: "success",
      message: "Avatar uploaded successfully",
      data: {
        avatar: {
          id: result.data.public_id,
          url: result.data.secure_url,
          format: result.data.format,
          size: result.data.bytes,
        },
      },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    cleanupTempFiles(req.file);
    res.status(500).json({
      status: "error",
      message: "Server error during avatar upload",
    });
  }
};

// @desc    Upload course thumbnail
// @route   POST /api/upload/thumbnail
// @access  Private/Admin
export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No thumbnail file provided",
      });
    }

    const file = req.file;

    // Validate file type for thumbnail
    const validation = validateFile(
      file,
      ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      5 * 1024 * 1024
    );
    if (!validation.valid) {
      cleanupTempFiles(file);
      return res.status(400).json({
        status: "error",
        message: validation.error,
      });
    }

    // Upload to R2 with thumbnail-specific options
    const result = await uploadToR2(file, "lms-king/thumbnails", {
      metadata: {
        originalName: file.originalname,
        fieldname: file.fieldname,
        type: "thumbnail",
      },
    });

    if (!result.success) {
      cleanupTempFiles(file);
      return res.status(500).json({
        status: "error",
        message: "Thumbnail upload failed",
        error: result.error,
      });
    }

    cleanupTempFiles(file);

    res.status(200).json({
      status: "success",
      message: "Thumbnail uploaded successfully",
      data: {
        thumbnail: {
          id: result.data.public_id,
          url: result.data.secure_url,
          format: result.data.format,
          size: result.data.bytes,
        },
      },
    });
  } catch (error) {
    console.error("Upload thumbnail error:", error);
    cleanupTempFiles(req.file);
    res.status(500).json({
      status: "error",
      message: "Server error during thumbnail upload",
    });
  }
};

// @desc    Upload course video
// @route   POST /api/upload/video
// @access  Private/Admin
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No video file provided",
      });
    }

    const file = req.file;

    // Validate file type for video
    const validation = validateFile(
      file,
      ["video/mp4", "video/avi", "video/mov", "video/webm"],
      100 * 1024 * 1024
    );
    if (!validation.valid) {
      cleanupTempFiles(file);
      return res.status(400).json({
        status: "error",
        message: validation.error,
      });
    }

    // Upload to R2 with video-specific options
    const result = await uploadToR2(file, "lms-king/videos", {
      metadata: {
        originalName: file.originalname,
        fieldname: file.fieldname,
        type: "video",
      },
    });

    if (!result.success) {
      cleanupTempFiles(file);
      return res.status(500).json({
        status: "error",
        message: "Video upload failed",
        error: result.error,
      });
    }

    cleanupTempFiles(file);

    res.status(200).json({
      status: "success",
      message: "Video uploaded successfully",
      data: {
        video: {
          id: result.data.public_id,
          url: result.data.secure_url,
          format: result.data.format,
          size: result.data.bytes,
          duration: result.data.duration,
        },
      },
    });
  } catch (error) {
    console.error("Upload video error:", error);
    cleanupTempFiles(req.file);
    res.status(500).json({
      status: "error",
      message: "Server error during video upload",
    });
  }
};

// @desc    Upload document
// @route   POST /api/upload/document
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No document file provided",
      });
    }

    const file = req.file;

    // Validate file type for document
    const validation = validateFile(
      file,
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      20 * 1024 * 1024
    );

    if (!validation.valid) {
      cleanupTempFiles(file);
      return res.status(400).json({
        status: "error",
        message: validation.error,
      });
    }

    // Upload to R2
    const result = await uploadToR2(file, "lms-king/documents", {
      metadata: {
        originalName: file.originalname,
        fieldname: file.fieldname,
        type: "document",
      },
    });

    if (!result.success) {
      cleanupTempFiles(file);
      return res.status(500).json({
        status: "error",
        message: "Document upload failed",
        error: result.error,
      });
    }

    cleanupTempFiles(file);

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
      data: {
        document: {
          id: result.data.public_id,
          url: result.data.secure_url,
          format: result.data.format,
          size: result.data.bytes,
        },
      },
    });
  } catch (error) {
    console.error("Upload document error:", error);
    cleanupTempFiles(req.file);
    res.status(500).json({
      status: "error",
      message: "Server error during document upload",
    });
  }
};

// @desc    Delete file from R2
// @route   DELETE /api/upload/:key
// @access  Private
export const deleteFile = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    const result = await deleteFromR2(key);

    if (!result.success) {
      return res.status(500).json({
        status: "error",
        message: "File deletion failed",
        error: result.error,
      });
    }

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during file deletion",
    });
  }
};

// @desc    Get file information
// @route   GET /api/upload/:key/info
// @access  Private
export const getFileInfo = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    const result = await getR2Info(key);

    if (!result.success) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
        error: result.error,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        file: result.data,
      },
    });
  } catch (error) {
    console.error("Get file info error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching file information",
    });
  }
};

// @desc    Generate optimized image URL
// @route   GET /api/upload/:key/optimized
// @access  Public
export const getOptimizedImage = async (req, res) => {
  try {
    const { key } = req.params;
    const { width, height, quality, format } = req.query;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    const options = {};
    if (width) options.width = parseInt(width);
    if (height) options.height = parseInt(height);
    if (quality) options.quality = quality;
    if (format) options.fetch_format = format;

    const optimizedUrl = getOptimizedImageUrl(key, options);

    res.status(200).json({
      status: "success",
      data: {
        optimized_url: optimizedUrl,
      },
    });
  } catch (error) {
    console.error("Get optimized image error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while generating optimized image URL",
    });
  }
};

// @desc    List files in a folder
// @route   GET /api/upload/list/:folder
// @access  Private
export const listFiles = async (req, res) => {
  try {
    const { folder } = req.params;
    const { maxResults = 50, continuationToken } = req.query;

    if (!folder) {
      return res.status(400).json({
        status: "error",
        message: "Folder name is required",
      });
    }

    const { listR2Files } = await import("../utils/r2.js");
    const result = await listR2Files(folder, {
      maxResults: parseInt(maxResults),
      continuationToken,
    });

    if (!result.success) {
      return res.status(500).json({
        status: "error",
        message: "Failed to list files",
        error: result.error,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        files: result.data.files,
        isTruncated: result.data.isTruncated,
        nextContinuationToken: result.data.nextContinuationToken,
      },
    });
  } catch (error) {
    console.error("List files error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while listing files",
    });
  }
};

// @desc    Update file metadata
// @route   PUT /api/upload/:key
// @access  Private
export const updateFileMetadata = async (req, res) => {
  try {
    const { key } = req.params;
    const { tags, context } = req.body;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    // For R2, metadata updates would require copying the object with new metadata
    // This is a placeholder implementation
    res.status(200).json({
      status: "success",
      message:
        "File metadata update feature requires object copy implementation",
      data: {
        key: key,
        updated: false,
      },
    });
  } catch (error) {
    console.error("Update file metadata error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while updating file metadata",
    });
  }
};

// @desc    Generate video thumbnail
// @route   POST /api/upload/:key/thumbnail
// @access  Private/Admin
export const generateThumbnail = async (req, res) => {
  try {
    const { key } = req.params;
    const { time = 10 } = req.body;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    const result = await generateVideoThumbnail(key, time);

    if (!result.success) {
      return res.status(500).json({
        status: "error",
        message: "Thumbnail generation failed",
        error: result.error,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Thumbnail generated successfully",
      data: {
        thumbnail: result.data,
      },
    });
  } catch (error) {
    console.error("Generate thumbnail error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while generating thumbnail",
    });
  }
};

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private/Admin
export const getUploadStats = async (req, res) => {
  try {
    // This would require listing all objects and aggregating statistics
    // For now, we'll return a placeholder response
    res.status(200).json({
      status: "success",
      data: {
        total_files: 0,
        total_size: 0,
        files_by_type: {
          images: 0,
          videos: 0,
          documents: 0,
        },
        message: "Upload statistics require object listing implementation",
      },
    });
  } catch (error) {
    console.error("Get upload stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching upload statistics",
    });
  }
};
