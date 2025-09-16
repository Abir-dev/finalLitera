import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const awsRegion = process.env.AWS_REGION;
const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL; // e.g. https://cdn.example.com or https://<bucket>.s3.<region>.amazonaws.com

if (!bucketName || !awsRegion) {
  // Do not throw at import time to avoid crashing tests/startup without envs
  console.warn(
    "S3 configuration missing. Ensure S3_BUCKET_NAME and AWS_REGION are set in environment variables."
  );
}

const s3Client = new S3Client({ region: awsRegion });

const buildPublicUrl = (key) => {
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${encodeURI(key)}`;
  }
  const regionHost = awsRegion
    ? `.s3.${awsRegion}.amazonaws.com`
    : ".s3.amazonaws.com";
  return `https://${bucketName}${regionHost}/${encodeURI(key)}`;
};

const inferFormatFromFilename = (filename) => {
  const ext = path
    .extname(filename || "")
    .toLowerCase()
    .replace(".", "");
  return ext || null;
};

export const uploadToS3 = async (
  file,
  keyPrefix = "uploads/videos",
  options = {}
) => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const key = `${keyPrefix.replace(/\/$/, "")}/${path.basename(file.path)}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
        ACL: options.acl || "public-read",
      },
      queueSize: 4,
      partSize: 8 * 1024 * 1024,
      leavePartsOnError: false,
    });

    await upload.done();

    return {
      success: true,
      data: {
        key,
        url: buildPublicUrl(key),
        format: inferFormatFromFilename(file.originalname),
        bytes: file.size,
      },
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteFromS3 = async (keyOrUrl) => {
  try {
    const key = parseKeyFromUrlIfNeeded(keyOrUrl);
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
    const result = await s3Client.send(command);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("S3 delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const parseKeyFromUrlIfNeeded = (keyOrUrl) => {
  if (!keyOrUrl) return keyOrUrl;
  // If it already looks like a key (no protocol and no bucket host), return as is
  if (!/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;

  try {
    const u = new URL(keyOrUrl);
    // Pathname starts with "/"
    const pathname = u.pathname.startsWith("/")
      ? u.pathname.slice(1)
      : u.pathname;
    return decodeURI(pathname);
  } catch {
    return keyOrUrl;
  }
};

export default {
  uploadToS3,
  deleteFromS3,
  parseKeyFromUrlIfNeeded,
};
