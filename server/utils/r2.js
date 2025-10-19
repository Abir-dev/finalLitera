import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Configure R2 (S3-compatible) client
const r2Client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for R2
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Upload file to R2
export const uploadToR2 = async (file, folder = "lms-king", options = {}) => {
  try {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const key = `${folder}/${fileName}`;

    // Read file content
    const fileContent = fs.readFileSync(file.path);

    // Upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        ...options.metadata,
      },
    };

    // Add additional options
    if (options.acl) uploadParams.ACL = options.acl;
    if (options.cacheControl) uploadParams.CacheControl = options.cacheControl;
    if (options.contentDisposition)
      uploadParams.ContentDisposition = options.contentDisposition;

    const command = new PutObjectCommand(uploadParams);
    const result = await r2Client.send(command);

    // Generate public URL
    const publicUrl = `${
      process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT
    }/${BUCKET_NAME}/${key}`;

    return {
      success: true,
      data: {
        key: key,
        public_id: key, // For compatibility with existing code
        secure_url: publicUrl,
        url: publicUrl,
        format: fileExtension.replace(".", ""),
        width: options.width || null,
        height: options.height || null,
        bytes: file.size,
        size: file.size,
        created_at: new Date().toISOString(),
        etag: result.ETag,
        versionId: result.VersionId,
      },
    };
  } catch (error) {
    console.error("R2 upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete file from R2
export const deleteFromR2 = async (key) => {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    const result = await r2Client.send(command);

    return {
      success: true,
      data: {
        result: "ok",
        deleted: true,
        key: key,
      },
    };
  } catch (error) {
    console.error("R2 delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get file info from R2
export const getR2Info = async (key) => {
  try {
    const headParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new HeadObjectCommand(headParams);
    const result = await r2Client.send(command);

    return {
      success: true,
      data: {
        key: key,
        size: result.ContentLength,
        contentType: result.ContentType,
        lastModified: result.LastModified,
        etag: result.ETag,
        metadata: result.Metadata || {},
      },
    };
  } catch (error) {
    console.error("R2 info error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate presigned URL for file access
export const getPresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });

    return {
      success: true,
      data: {
        presignedUrl: presignedUrl,
        expiresIn: expiresIn,
      },
    };
  } catch (error) {
    console.error("R2 presigned URL error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate optimized image URL (for compatibility with existing code)
export const getOptimizedImageUrl = (key, options = {}) => {
  // For R2, we'll return the direct URL since R2 doesn't have built-in transformations
  // You might want to implement image optimization using a service like Cloudflare Image Resizing
  const baseUrl = process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT;
  return `${baseUrl}/${BUCKET_NAME}/${key}`;
};

// Generate video thumbnail (placeholder - would need additional service)
export const generateVideoThumbnail = async (key, time = 10) => {
  try {
    // This would require a separate video processing service
    // For now, return a placeholder response
    return {
      success: false,
      error:
        "Video thumbnail generation requires additional video processing service",
    };
  } catch (error) {
    console.error("Video thumbnail generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// List files in a folder
export const listR2Files = async (folder, options = {}) => {
  try {
    const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");

    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: folder,
      MaxKeys: options.maxResults || 1000,
    };

    if (options.continuationToken) {
      listParams.ContinuationToken = options.continuationToken;
    }

    const command = new ListObjectsV2Command(listParams);
    const result = await r2Client.send(command);

    const files = (result.Contents || []).map((obj) => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      etag: obj.ETag,
    }));

    return {
      success: true,
      data: {
        files: files,
        isTruncated: result.IsTruncated,
        nextContinuationToken: result.NextContinuationToken,
      },
    };
  } catch (error) {
    console.error("R2 list files error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Copy file within R2
export const copyR2File = async (sourceKey, destinationKey) => {
  try {
    const { CopyObjectCommand } = await import("@aws-sdk/client-s3");

    const copyParams = {
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    };

    const command = new CopyObjectCommand(copyParams);
    const result = await r2Client.send(command);

    return {
      success: true,
      data: {
        copied: true,
        sourceKey: sourceKey,
        destinationKey: destinationKey,
        etag: result.CopyObjectResult?.ETag,
      },
    };
  } catch (error) {
    console.error("R2 copy file error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Initialize R2 connection
const connectR2 = async () => {
  try {
    // Test connection by listing objects
    const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      MaxKeys: 1,
    });

    await r2Client.send(command);
    console.log("✅ R2 (Cloudflare) configured successfully");
    return true;
  } catch (error) {
    console.error("❌ R2 configuration error:", error);
    return false;
  }
};

export default connectR2;
