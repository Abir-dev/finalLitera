import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'lms-king', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      ...options
    });
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      data: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get file info from Cloudinary
export const getCloudinaryInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Cloudinary info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Generate video thumbnail
export const generateVideoThumbnail = async (publicId, time = 10) => {
  try {
    const result = await cloudinary.video(publicId, {
      start_offset: time,
      flags: 'splice',
      overwrite: true,
      resource_type: 'image'
    });
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Video thumbnail generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Initialize Cloudinary connection
const connectCloudinary = async () => {
  try {
    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error);
    return false;
  }
};

export default connectCloudinary;