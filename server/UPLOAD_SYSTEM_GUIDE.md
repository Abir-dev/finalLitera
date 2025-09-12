# File Upload System Guide

## Overview

The LMS-kinG backend now includes a comprehensive file upload system powered by Cloudinary and Multer. This system supports uploading images, videos, documents, and other file types with proper validation, storage, and management.

## Features

- ✅ **Multiple File Types**: Images, videos, documents, avatars, thumbnails
- ✅ **Cloudinary Integration**: Cloud storage with CDN and transformations
- ✅ **File Validation**: Type, size, and format validation
- ✅ **Security**: Authentication and authorization for uploads
- ✅ **File Management**: Delete, update metadata, get file info
- ✅ **Optimization**: Automatic image optimization and video thumbnails
- ✅ **Database Tracking**: File metadata stored in MongoDB

## Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

### 2. Cloudinary Account Setup

1. Create a free Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your environment variables

## API Endpoints

### Upload Endpoints

#### Upload Single File
```http
POST /api/upload/single
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- file: <file>
- folder: <optional folder name>
- options: <optional JSON string with upload options>
```

#### Upload Multiple Files
```http
POST /api/upload/multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- images: <file1>, <file2>, <file3>
- folder: <optional folder name>
```

#### Upload Avatar
```http
POST /api/upload/avatar
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- avatar: <image file>
```

#### Upload Course Thumbnail
```http
POST /api/upload/thumbnail
Content-Type: multipart/form-data
Authorization: Bearer <token>
Role: admin only

Body:
- thumbnail: <image file>
```

#### Upload Course Video
```http
POST /api/upload/video
Content-Type: multipart/form-data
Authorization: Bearer <token>
Role: admin only

Body:
- video: <video file>
```

#### Upload Document
```http
POST /api/upload/document
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- document: <document file>
```

### File Management Endpoints

#### Delete File
```http
DELETE /api/upload/:publicId
Authorization: Bearer <token>
```

#### Get File Information
```http
GET /api/upload/:publicId/info
Authorization: Bearer <token>
```

#### Get Optimized Image URL
```http
GET /api/upload/:publicId/optimized?width=300&height=200&quality=auto
```

#### List Files in Folder
```http
GET /api/upload/list/:folder?maxResults=50&nextCursor=<cursor>
Authorization: Bearer <token>
```

#### Update File Metadata
```http
PUT /api/upload/:publicId
Authorization: Bearer <token>

Body:
{
  "tags": ["course", "thumbnail"],
  "context": {
    "course": "course_id",
    "alt": "Course thumbnail"
  }
}
```

#### Generate Video Thumbnail
```http
POST /api/upload/:publicId/thumbnail
Authorization: Bearer <token>
Role: admin only

Body:
{
  "time": 10  // seconds into video
}
```

#### Get Upload Statistics
```http
GET /api/upload/stats
Authorization: Bearer <token>
Role: admin
```

## File Types and Limits

### Supported File Types

#### Images
- **Types**: JPEG, JPG, PNG, GIF, WebP
- **Max Size**: 5MB
- **Use Cases**: Avatars, thumbnails, course images

#### Videos
- **Types**: MP4, AVI, MOV, WMV, WebM
- **Max Size**: 100MB
- **Use Cases**: Course videos, lesson content

#### Documents
- **Types**: PDF, DOC, DOCX, TXT
- **Max Size**: 20MB
- **Use Cases**: Course materials, assignments

### File Organization

Files are organized in Cloudinary folders:
- `lms-king/avatars/` - User profile pictures
- `lms-king/thumbnails/` - Course thumbnails
- `lms-king/videos/` - Course videos
- `lms-king/documents/` - Course documents
- `lms-king/images/` - General images

## Usage Examples

### Frontend Integration

#### Upload Avatar (React)
```javascript
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch('/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  return result.data.avatar;
};
```

#### Upload Course Thumbnail (Admin Only)
```javascript
const uploadThumbnail = async (file) => {
  const formData = new FormData();
  formData.append('thumbnail', file);
  
  const response = await fetch('/api/upload/thumbnail', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  });
  
  const result = await response.json();
  return result.data.thumbnail;
};
```

#### Get Optimized Image
```javascript
const getOptimizedImage = (publicId, width = 300, height = 200) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}`;
};
```

### Backend Integration

#### Update User Avatar
```javascript
// In userController.js
export const updateUserAvatar = async (req, res) => {
  try {
    const { publicId, url } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        avatar: url,
        avatarFile: publicId 
      },
      { new: true }
    );
    
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
```

## Error Handling

### Common Errors

#### File Too Large
```json
{
  "status": "error",
  "message": "File too large. Maximum size allowed is 10MB."
}
```

#### Invalid File Type
```json
{
  "status": "error",
  "message": "File type image/gif is not allowed"
}
```

#### Upload Failed
```json
{
  "status": "error",
  "message": "Upload failed",
  "error": "Cloudinary error details"
}
```

## Security Features

1. **Authentication Required**: All upload endpoints require valid JWT token
2. **Role-Based Access**: Some endpoints require specific roles (instructor, admin)
3. **File Type Validation**: Only allowed file types can be uploaded
4. **Size Limits**: File size restrictions prevent abuse
5. **Temporary File Cleanup**: Temporary files are automatically deleted after upload

## Performance Optimizations

1. **Automatic Image Optimization**: Cloudinary automatically optimizes images
2. **CDN Delivery**: Files are served through Cloudinary's global CDN
3. **Lazy Loading**: Video thumbnails are generated on demand
4. **Compression**: Files are automatically compressed during upload

## Monitoring and Analytics

The system tracks:
- File upload statistics
- File access patterns
- Storage usage
- Performance metrics

## Troubleshooting

### Common Issues

1. **Cloudinary Configuration Error**
   - Check environment variables
   - Verify Cloudinary credentials

2. **File Upload Fails**
   - Check file size and type
   - Verify network connection
   - Check server logs

3. **Permission Denied**
   - Verify user authentication
   - Check user role permissions

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Future Enhancements

- [ ] Bulk file operations
- [ ] File versioning
- [ ] Advanced image transformations
- [ ] Video processing and compression
- [ ] File sharing and collaboration
- [ ] Integration with external storage providers

## Support

For issues or questions about the file upload system:
1. Check the server logs
2. Verify Cloudinary configuration
3. Test with smaller files first
4. Check network connectivity
