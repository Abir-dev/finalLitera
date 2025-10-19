import axios from "axios";

const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "https://finallitera.onrender.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes timeout for video uploads
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Live Class Recording Service
export const liveClassRecordingService = {
  // Get all live class recordings with optional filters
  getRecordings: async (params = {}) => {
    try {
      const response = await api.get("/live-class-recordings", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching recordings:", error);
      throw error.response?.data || { message: "Failed to fetch recordings" };
    }
  },

  // Get recording by ID
  getRecordingById: async (id) => {
    try {
      const response = await api.get(`/live-class-recordings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recording:", error);
      throw error.response?.data || { message: "Failed to fetch recording" };
    }
  },

  // Create new recording
  createRecording: async (recordingData) => {
    try {
      const formData = new FormData();

      // Add all form fields
      Object.keys(recordingData).forEach((key) => {
        if (key === "video" && recordingData[key]) {
          formData.append("video", recordingData[key]);
        } else if (
          recordingData[key] !== null &&
          recordingData[key] !== undefined
        ) {
          formData.append(key, recordingData[key]);
        }
      });

      const response = await api.post("/live-class-recordings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes timeout for video uploads
      });
      return response.data;
    } catch (error) {
      console.error("Error creating recording:", error);
      throw error.response?.data || { message: "Failed to create recording" };
    }
  },

  // Update recording
  updateRecording: async (id, recordingData) => {
    try {
      const response = await api.put(
        `/live-class-recordings/${id}`,
        recordingData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating recording:", error);
      throw error.response?.data || { message: "Failed to update recording" };
    }
  },

  // Delete recording
  deleteRecording: async (id) => {
    try {
      const response = await api.delete(`/live-class-recordings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting recording:", error);
      throw error.response?.data || { message: "Failed to delete recording" };
    }
  },

  // Get recordings by course
  getRecordingsByCourse: async (courseId, params = {}) => {
    try {
      const response = await api.get(
        `/live-class-recordings/course/${courseId}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recordings by course:", error);
      throw (
        error.response?.data || {
          message: "Failed to fetch recordings by course",
        }
      );
    }
  },

  // Get recording statistics
  getStatistics: async () => {
    try {
      const response = await api.get("/live-class-recordings/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching recording statistics:", error);
      throw (
        error.response?.data || {
          message: "Failed to fetch recording statistics",
        }
      );
    }
  },

  // Upload video file only (for separate upload)
  uploadVideo: async (file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await api.post("/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes timeout for video uploads
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error.response?.data || { message: "Failed to upload video" };
    }
  },
};

// Utility functions
export const recordingUtils = {
  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Format duration
  formatDuration: (duration) => {
    if (!duration) return "Unknown";

    // Handle different duration formats
    if (duration.includes(":")) {
      const parts = duration.split(":");
      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return `${minutes}m ${seconds}s`;
      }
    }

    return duration;
  },

  // Format date
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Validate video file
  validateVideoFile: (file) => {
    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm",
    ];
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: "Please select a valid video file (MP4, AVI, MOV, WMV, WEBM)",
      };
    }

    if (file.size > maxSize) {
      return { valid: false, message: "File size must be less than 5GB" };
    }

    return { valid: true };
  },

  // Get video thumbnail (placeholder for now)
  getVideoThumbnail: (videoUrl) => {
    // This would typically generate a thumbnail from the video
    // For now, return a placeholder
    return "/icons/video-placeholder.png";
  },
};

export default liveClassRecordingService;
