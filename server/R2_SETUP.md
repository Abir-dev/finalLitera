# Cloudflare R2 Setup Guide

This guide explains how to configure Cloudflare R2 for file uploads in the LMS application.

## Prerequisites

1. A Cloudflare account
2. R2 bucket created in your Cloudflare dashboard

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudflare R2 Configuration (S3-compatible)
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-custom-domain.com
R2_REGION=auto
```

## Getting R2 Credentials

1. **Access Key ID & Secret Access Key:**

   - Go to Cloudflare Dashboard → R2 Object Storage → Manage R2 API tokens
   - Create a new API token with R2 permissions
   - Copy the Access Key ID and Secret Access Key

2. **Bucket Name:**

   - Create a bucket in R2 Object Storage
   - Use the bucket name as `R2_BUCKET_NAME`

3. **Endpoint:**

   - Your R2 endpoint URL (usually `https://your-account-id.r2.cloudflarestorage.com`)
   - Find this in your R2 dashboard

4. **Public URL (Optional):**
   - If you have a custom domain configured for your R2 bucket
   - Otherwise, files will be accessible via the R2 endpoint URL

## Features Implemented

### Upload Functions

- ✅ Single file upload
- ✅ Multiple file upload
- ✅ Avatar upload
- ✅ Thumbnail upload
- ✅ Video upload
- ✅ Document upload

### File Management

- ✅ File deletion
- ✅ File information retrieval
- ✅ File listing by folder
- ✅ Presigned URL generation

### Compatibility

- ✅ Maintains same API structure as Cloudinary
- ✅ Uses S3-compatible AWS SDK
- ✅ Supports all file types (images, videos, documents)

## API Endpoints

All endpoints remain the same as the original Cloudinary implementation:

- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/thumbnail` - Upload thumbnail
- `POST /api/upload/video` - Upload video
- `POST /api/upload/document` - Upload document
- `DELETE /api/upload/:key` - Delete file
- `GET /api/upload/:key/info` - Get file info
- `GET /api/upload/:key/optimized` - Get optimized URL
- `GET /api/upload/list/:folder` - List files in folder

## File Structure

Files are organized in the following folder structure:

```
lms-king/
├── avatars/          # User profile pictures
├── thumbnails/       # Course thumbnails
├── videos/           # Course videos
├── documents/        # Course documents
└── images/           # General images
```

## Migration from Cloudinary

The implementation maintains backward compatibility:

- `public_id` field is mapped to `key`
- `secure_url` field is mapped to `url`
- All response structures remain the same

## Limitations

1. **Image Transformations:** R2 doesn't have built-in image transformations like Cloudinary. Consider using Cloudflare Image Resizing for dynamic image optimization.

2. **Video Thumbnails:** Video thumbnail generation requires additional video processing service.

3. **Metadata Updates:** Updating file metadata requires copying the object with new metadata.

## Testing

To test the R2 integration:

1. Set up your environment variables
2. Start the server
3. Use the upload endpoints to test file uploads
4. Verify files appear in your R2 bucket
5. Test file deletion and retrieval

## Troubleshooting

### Common Issues

1. **Authentication Error:**

   - Verify your R2 credentials are correct
   - Check that the API token has proper permissions

2. **Bucket Not Found:**

   - Ensure the bucket name is correct
   - Verify the bucket exists in your R2 dashboard

3. **Endpoint Issues:**

   - Check that the R2 endpoint URL is correct
   - Ensure your account ID is properly formatted

4. **CORS Issues:**
   - Configure CORS settings in your R2 bucket if accessing from browser
   - Add your domain to allowed origins

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed error messages in the console.
