import axios from "axios";

// API base URL - adjust according to your server configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const recordingService = {
  // Get recordings for student's enrolled courses
  getStudentRecordings: async () => {
    try {
      const response = await api.get("/live-class-recordings/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching student recordings:", error);
      throw error;
    }
  },

  // Get recordings for a specific course
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

  // Get a specific recording by ID (for video player)
  getRecordingById: async (recordingId) => {
    try {
      const response = await api.get(`/live-class-recordings/${recordingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recording:", error);
      throw error;
    }
  },
};

export default recordingService;
