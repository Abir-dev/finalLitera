import axios from "axios";

// API base URL - adjust according to your server configuration
const API_URL = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("API Error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      // Only auto-logout if it's a clear authentication error
      // Check if the error message indicates token issues
      const errorMessage = error.response?.data?.message || "";

      if (
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("Token") ||
        errorMessage.includes("Unauthorized")
      ) {
        console.log("Authentication error detected, logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.log(
          "401 error but not authentication related, not logging out"
        );
        // Don't auto-logout for other 401 errors
      }
    }
    return Promise.reject(error);
  }
);

const recordingService = {
  // Get user's enrollments with enrollment IDs
  getUserEnrollments: async () => {
    try {
      const response = await api.get(
        "/live-class-recordings/student/enrollments"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      throw error;
    }
  },

  // Get recordings for a specific enrollment
  getRecordingsByEnrollment: async (enrollmentId, page = 1, limit = 20) => {
    try {
      console.log("Fetching recordings for enrollment:", enrollmentId);
      console.log(
        "API URL:",
        `/live-class-recordings/student/enrollment/${enrollmentId}`
      );
      console.log("Token exists:", !!localStorage.getItem("token"));

      const response = await api.get(
        `/live-class-recordings/student/enrollment/${enrollmentId}`,
        {
          params: { page, limit },
        }
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recordings by enrollment:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.response?.data);
      throw error;
    }
  },

  // Get recordings for student's enrolled courses (legacy method - kept for backward compatibility)
  getStudentRecordings: async () => {
    try {
      const response = await api.get("/live-class-recordings/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching student recordings:", error);
      throw error;
    }
  },

  // Get recordings for a specific course (legacy method - kept for backward compatibility)
  getStudentCourseRecordings: async (courseId, page = 1, limit = 20) => {
    try {
      const response = await api.get(
        `/live-class-recordings/student/course/${courseId}`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course recordings:", error);
      throw error;
    }
  },

  // Get a specific recording by ID (for video player) - Student endpoint
  getRecordingById: async (recordingId, includeEnrolledUsers = false) => {
    try {
      console.log("Fetching recording by ID:", recordingId);
      const response = await api.get(
        `/live-class-recordings/student/${recordingId}`,
        {
          params: { includeEnrolledUsers },
        }
      );
      console.log("Recording fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recording:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.response?.data);
      throw error;
    }
  },

  // Get enrolled users for a specific recording (Admin only)
  getEnrolledUsersForRecording: async (recordingId, page = 1, limit = 20) => {
    try {
      const response = await api.get(
        `/live-class-recordings/${recordingId}/enrolled-users`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled users for recording:", error);
      throw error;
    }
  },

  // Get enrolled users for a course (Admin only)
  getEnrolledUsersForCourse: async (courseId, page = 1, limit = 20) => {
    try {
      const response = await api.get(
        `/live-class-recordings/course/${courseId}/enrolled-users`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled users for course:", error);
      throw error;
    }
  },

  // Get recordings by course with optional enrolled users (Admin only)
  getRecordingsByCourse: async (
    courseId,
    page = 1,
    limit = 10,
    includeEnrolledUsers = false
  ) => {
    try {
      const response = await api.get(
        `/live-class-recordings/course/${courseId}`,
        {
          params: { page, limit, includeEnrolledUsers },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recordings by course:", error);
      throw error;
    }
  },
};

export default recordingService;
