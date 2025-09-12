# Postman Testing Guide for File Upload System

## Setup Instructions

### 1. Environment Variables
Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:5000",
  "token": "your_jwt_token_here",
  "admin_token": "admin_jwt_token_here",
  "student_token": "student_jwt_token_here"
}
```

### 2. Authentication Setup
First, get authentication tokens by logging in:

#### Get Student Token
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Admin Token
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## File Upload Tests

### 1. Upload Single File (General)

**Request:**
```http
POST {{base_url}}/api/upload/single
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- file: [Select any image file]
- folder: "test-uploads"
- options: {"quality": "auto", "format": "auto"}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": "lms-king/test-uploads/filename-123456789",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/lms-king/test-uploads/filename-123456789.jpg",
      "format": "jpg",
      "size": 245760,
      "width": 800,
      "height": 600,
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. Upload Multiple Files

**Request:**
```http
POST {{base_url}}/api/upload/multiple
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- images: [Select multiple image files]
- folder: "course-images"
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "3 files uploaded successfully",
  "data": {
    "uploaded": [
      {
        "originalName": "image1.jpg",
        "id": "lms-king/course-images/image1-123456789",
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/lms-king/course-images/image1-123456789.jpg",
        "format": "jpg",
        "size": 245760,
        "width": 800,
        "height": 600
      }
    ],
    "errors": []
  }
}
```

### 3. Upload Avatar (Student/All Users)

**Request:**
```http
POST {{base_url}}/api/upload/avatar
Authorization: Bearer {{student_token}}
Content-Type: multipart/form-data

Body (form-data):
- avatar: [Select a profile picture - JPG/PNG, max 5MB]
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": {
      "id": "lms-king/avatars/avatar-123456789",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/w_200,h_200,c_fill,g_face,q_auto,f_auto/lms-king/avatars/avatar-123456789.jpg",
      "format": "jpg",
      "size": 125440
    }
  }
}
```

### 4. Upload Course Thumbnail (Admin Only)

**Request:**
```http
POST {{base_url}}/api/upload/thumbnail
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data

Body (form-data):
- thumbnail: [Select a course thumbnail - JPG/PNG, max 5MB]
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Thumbnail uploaded successfully",
  "data": {
    "thumbnail": {
      "id": "lms-king/thumbnails/thumbnail-123456789",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_450,c_fill,q_auto,f_auto/lms-king/thumbnails/thumbnail-123456789.jpg",
      "format": "jpg",
      "size": 156800
    }
  }
}
```

### 5. Upload Course Video (Admin Only)

**Request:**
```http
POST {{base_url}}/api/upload/video
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data

Body (form-data):
- video: [Select a video file - MP4/WebM, max 100MB]
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "id": "lms-king/videos/video-123456789",
      "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/lms-king/videos/video-123456789.mp4",
      "format": "mp4",
      "size": 15728640,
      "duration": 120.5
    }
  }
}
```

### 6. Upload Document

**Request:**
```http
POST {{base_url}}/api/upload/document
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- document: [Select a PDF/DOC file, max 20MB]
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "lms-king/documents/document-123456789",
      "url": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/lms-king/documents/document-123456789.pdf",
      "format": "pdf",
      "size": 1048576
    }
  }
}
```

## File Management Tests

### 7. Get File Information

**Request:**
```http
GET {{base_url}}/api/upload/lms-king/avatars/avatar-123456789/info
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "file": {
      "public_id": "lms-king/avatars/avatar-123456789",
      "format": "jpg",
      "version": 1234567890,
      "resource_type": "image",
      "type": "upload",
      "created_at": "2024-01-15T10:30:00Z",
      "bytes": 125440,
      "width": 200,
      "height": 200,
      "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/lms-king/avatars/avatar-123456789.jpg"
    }
  }
}
```

### 8. Get Optimized Image URL

**Request:**
```http
GET {{base_url}}/api/upload/lms-king/thumbnails/thumbnail-123456789/optimized?width=400&height=300&quality=80&format=webp
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "optimized_url": "https://res.cloudinary.com/your-cloud/image/upload/w_400,h_300,q_80,f_webp/lms-king/thumbnails/thumbnail-123456789"
  }
}
```

### 9. Delete File

**Request:**
```http
DELETE {{base_url}}/api/upload/lms-king/test-uploads/filename-123456789
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "File deleted successfully",
  "data": {
    "result": "ok"
  }
}
```

### 10. Generate Video Thumbnail

**Request:**
```http
POST {{base_url}}/api/upload/lms-king/videos/video-123456789/thumbnail
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "time": 30
}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Thumbnail generated successfully",
  "data": {
    "thumbnail": {
      "url": "https://res.cloudinary.com/your-cloud/image/upload/so_30/lms-king/videos/video-123456789.jpg"
    }
  }
}
```

### 11. List Files in Folder

**Request:**
```http
GET {{base_url}}/api/upload/list/avatars?maxResults=10
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "File listing feature requires Cloudinary Admin API setup",
  "data": {
    "files": [],
    "next_cursor": null
  }
}
```

### 12. Update File Metadata

**Request:**
```http
PUT {{base_url}}/api/upload/lms-king/thumbnails/thumbnail-123456789
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "tags": ["course", "thumbnail", "web-development"],
  "context": {
    "course": "64a1b2c3d4e5f6789012345",
    "alt": "Complete Web Development Bootcamp thumbnail"
  }
}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "File metadata update feature requires Cloudinary Admin API setup",
  "data": {
    "public_id": "lms-king/thumbnails/thumbnail-123456789",
    "updated": false
  }
}
```

### 13. Get Upload Statistics (Admin Only)

**Request:**
```http
GET {{base_url}}/api/upload/stats
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "total_files": 0,
    "total_size": 0,
    "files_by_type": {
      "images": 0,
      "videos": 0,
      "documents": 0
    },
    "message": "Upload statistics require Cloudinary Admin API setup"
  }
}
```

## Error Testing

### 14. Upload Without Authentication

**Request:**
```http
POST {{base_url}}/api/upload/avatar
Content-Type: multipart/form-data

Body (form-data):
- avatar: [Select any image file]
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Not authorized"
}
```

### 15. Upload with Wrong Role (Student trying to upload thumbnail)

**Request:**
```http
POST {{base_url}}/api/upload/thumbnail
Authorization: Bearer {{student_token}}
Content-Type: multipart/form-data

Body (form-data):
- thumbnail: [Select any image file]
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "You do not have permission to access this route"
}
```

### 16. Upload File Too Large

**Request:**
```http
POST {{base_url}}/api/upload/avatar
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- avatar: [Select a file larger than 5MB]
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "File too large. Maximum size allowed is 10MB."
}
```

### 17. Upload Invalid File Type

**Request:**
```http
POST {{base_url}}/api/upload/avatar
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- avatar: [Select a .txt or .exe file]
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "File type text/plain is not allowed"
}
```

### 18. Delete Non-existent File

**Request:**
```http
DELETE {{base_url}}/api/upload/non-existent-file-id
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "File deletion failed",
  "error": "Not found"
}
```

## Test Files for Upload

### Sample Test Files to Create:

1. **Avatar Images** (for avatar uploads):
   - `avatar.jpg` (200x200px, < 1MB)
   - `avatar.png` (300x300px, < 1MB)
   - `large-avatar.jpg` (2000x2000px, > 5MB) - for error testing

2. **Course Thumbnails** (for thumbnail uploads):
   - `course-thumbnail.jpg` (800x450px, < 2MB)
   - `course-thumbnail.png` (1200x675px, < 2MB)

3. **Videos** (for video uploads):
   - `sample-video.mp4` (< 50MB, 2-3 minutes)
   - `large-video.mp4` (> 100MB) - for error testing

4. **Documents** (for document uploads):
   - `course-material.pdf` (< 5MB)
   - `assignment.docx` (< 2MB)
   - `large-document.pdf` (> 20MB) - for error testing

5. **Invalid Files** (for error testing):
   - `test.txt` (text file)
   - `malware.exe` (executable file)
   - `corrupted.jpg` (corrupted image)

## Postman Collection JSON

Here's a complete Postman collection you can import:

```json
{
  "info": {
    "name": "LMS-kinG File Upload API",
    "description": "Complete testing collection for file upload system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "admin_token",
      "value": ""
    },
    {
      "key": "student_token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login Student",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Login Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "File Uploads",
      "item": [
        {
          "name": "Upload Single File",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": []
                },
                {
                  "key": "folder",
                  "value": "test-uploads",
                  "type": "text"
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/single",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "single"]
            }
          }
        },
        {
          "name": "Upload Avatar",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{student_token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "avatar",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/avatar",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "avatar"]
            }
          }
        },
        {
          "name": "Upload Thumbnail (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "thumbnail",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/thumbnail",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "thumbnail"]
            }
          }
        },
        {
          "name": "Upload Video (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "video",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/video",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "video"]
            }
          }
        },
        {
          "name": "Upload Document",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "document",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/document",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "document"]
            }
          }
        }
      ]
    },
    {
      "name": "File Management",
      "item": [
        {
          "name": "Get File Info",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/upload/{{public_id}}/info",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "{{public_id}}", "info"]
            }
          }
        },
        {
          "name": "Get Optimized Image",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/upload/{{public_id}}/optimized?width=400&height=300&quality=80",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "{{public_id}}", "optimized"],
              "query": [
                {
                  "key": "width",
                  "value": "400"
                },
                {
                  "key": "height",
                  "value": "300"
                },
                {
                  "key": "quality",
                  "value": "80"
                }
              ]
            }
          }
        },
        {
          "name": "Delete File",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/upload/{{public_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "{{public_id}}"]
            }
          }
        },
        {
          "name": "Generate Video Thumbnail",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"time\": 30\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/upload/{{video_public_id}}/thumbnail",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "{{video_public_id}}", "thumbnail"]
            }
          }
        },
        {
          "name": "Get Upload Stats (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{admin_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/upload/stats",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "stats"]
            }
          }
        }
      ]
    },
    {
      "name": "Error Testing",
      "item": [
        {
          "name": "Upload Without Auth",
          "request": {
            "method": "POST",
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "avatar",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/avatar",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "avatar"]
            }
          }
        },
        {
          "name": "Wrong Role - Student Upload Thumbnail",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{student_token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "thumbnail",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/upload/thumbnail",
              "host": ["{{base_url}}"],
              "path": ["api", "upload", "thumbnail"]
            }
          }
        }
      ]
    }
  ]
}
```

## Testing Checklist

### ✅ Basic Functionality
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Upload avatar (all users)
- [ ] Upload thumbnail (instructor only)
- [ ] Upload video (instructor only)
- [ ] Upload document (all users)

### ✅ File Management
- [ ] Get file information
- [ ] Get optimized image URL
- [ ] Delete file
- [ ] Generate video thumbnail
- [ ] List files in folder
- [ ] Update file metadata
- [ ] Get upload statistics (admin)

### ✅ Error Handling
- [ ] Upload without authentication
- [ ] Upload with wrong role
- [ ] Upload file too large
- [ ] Upload invalid file type
- [ ] Delete non-existent file
- [ ] Access admin endpoints without admin role

### ✅ Security
- [ ] Authentication required for all uploads
- [ ] Role-based access control
- [ ] File type validation
- [ ] File size limits
- [ ] Proper error messages

## Notes

1. **Replace tokens**: Update the token variables after logging in
2. **File paths**: Make sure to select actual files for upload tests
3. **Public IDs**: Save public IDs from upload responses for management tests
4. **Cloudinary setup**: Ensure Cloudinary credentials are configured
5. **File sizes**: Test with files of different sizes to verify limits

This comprehensive testing suite will help you verify all aspects of the file upload system! 🚀
