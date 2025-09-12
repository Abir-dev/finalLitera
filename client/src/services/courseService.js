import axios from "axios";

// API base URL - adjust according to your server configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    console.log("Request interceptor - Token:", token ? "Present" : "Missing");
    console.log("Request interceptor - URL:", config.url);
    console.log("Request interceptor - Method:", config.method);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request interceptor - Authorization header set");
    } else {
      console.log("Request interceptor - No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
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

// Course API Service
export const courseService = {
  // Get all courses with optional filters
  getCourses: async (params = {}) => {
    try {
      const response = await api.get("/courses", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error.response?.data || { message: "Failed to fetch courses" };
    }
  },

  // Get featured courses
  getFeaturedCourses: async () => {
    try {
      const response = await api.get("/courses/featured");
      return response.data;
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      throw (
        error.response?.data || { message: "Failed to fetch featured courses" }
      );
    }
  },

  // Get LaunchPad courses
  getLaunchPadCourses: async () => {
    try {
      const response = await api.get("/courses/launchpad");
      return response.data;
    } catch (error) {
      console.error("Error fetching LaunchPad courses:", error);
      throw (
        error.response?.data || { message: "Failed to fetch LaunchPad courses" }
      );
    }
  },

  // Get course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error.response?.data || { message: "Failed to fetch course" };
    }
  },

  // Create new course (Admin/Instructor only)
  createCourse: async (courseData) => {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error.response?.data || { message: "Failed to create course" };
    }
  },

  // Update course (Admin/Instructor only)
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error.response?.data || { message: "Failed to update course" };
    }
  },

  // Delete course (Admin/Instructor only)
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error.response?.data || { message: "Failed to delete course" };
    }
  },

  // Enroll in course
  enrollInCourse: async (id) => {
    try {
      const response = await api.post(`/courses/${id}/enroll`);
      return response.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error.response?.data || { message: "Failed to enroll in course" };
    }
  },

  // Add course review
  addCourseReview: async (id, reviewData) => {
    try {
      const response = await api.post(`/courses/${id}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error.response?.data || { message: "Failed to add review" };
    }
  },

  // Get course categories
  getCourseCategories: async () => {
    try {
      const response = await api.get("/courses/categories/list");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error.response?.data || { message: "Failed to fetch categories" };
    }
  },

  // Get courses by instructor (Admin only)
  getCoursesByInstructor: async (instructorId, params = {}) => {
    try {
      const response = await api.get(`/courses/instructor/${instructorId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      throw (
        error.response?.data || {
          message: "Failed to fetch instructor courses",
        }
      );
    }
  },

  // Test authentication
  testAuth: async () => {
    try {
      const response = await api.get("/payments/test-auth");
      return response.data;
    } catch (error) {
      console.error("Error testing auth:", error);
      throw error.response?.data || { message: "Failed to test auth" };
    }
  },

  // Test no auth endpoint
  testNoAuth: async () => {
    try {
      const response = await api.get("/payments/test-no-auth");
      return response.data;
    } catch (error) {
      console.error("Error testing no auth:", error);
      throw error.response?.data || { message: "Failed to test no auth" };
    }
  },

  // Payments
  createOrder: async (courseId) => {
    try {
      const response = await api.post("/payments/create-order", { courseId });
      return response.data; // { status, data: { order, course } }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error.response?.data || { message: "Failed to create order" };
    }
  },
};

// Upload Service for file uploads
export const uploadService = {
  // Upload single file
  uploadSingle: async (file, folder = "lms-king", options = {}) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      if (options) {
        formData.append("options", JSON.stringify(options));
      }

      const response = await api.post("/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout for file uploads
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error.response?.data || { message: "Failed to upload file" };
    }
  },

  // Upload multiple files
  uploadMultiple: async (files, folder = "lms-king") => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", folder);

      const response = await api.post("/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout for multiple files
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error.response?.data || { message: "Failed to upload files" };
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error.response?.data || { message: "Failed to upload avatar" };
    }
  },

  // Upload course thumbnail
  uploadThumbnail: async (file) => {
    try {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const response = await api.post("/upload/thumbnail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      throw error.response?.data || { message: "Failed to upload thumbnail" };
    }
  },

  // Upload course video
  uploadVideo: async (file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await api.post("/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minute timeout for video uploads
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error.response?.data || { message: "Failed to upload video" };
    }
  },

  // Upload document
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await api.post("/upload/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error.response?.data || { message: "Failed to upload document" };
    }
  },

  // Delete file
  deleteFile: async (publicId) => {
    try {
      const response = await api.delete(`/upload/${publicId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error.response?.data || { message: "Failed to delete file" };
    }
  },

  // Get file information
  getFileInfo: async (publicId) => {
    try {
      const response = await api.get(`/upload/${publicId}/info`);
      return response.data;
    } catch (error) {
      console.error("Error fetching file info:", error);
      throw error.response?.data || { message: "Failed to fetch file info" };
    }
  },

  // Get optimized image URL
  getOptimizedImage: async (publicId, options = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(options).forEach((key) => {
        if (options[key]) params.append(key, options[key]);
      });

      const response = await api.get(`/upload/${publicId}/optimized?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error getting optimized image:", error);
      throw (
        error.response?.data || { message: "Failed to get optimized image" }
      );
    }
  },
};

// Utility functions
export const courseUtils = {
  // Format course data for display
  formatCourseForDisplay: (course) => {
    return {
      id: course._id || course.id,
      title: course.title,
      shortDescription:
        course.shortDescription ||
        course.description?.substring(0, 100) + "...",
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      price: course.price,
      originalPrice: course.originalPrice,
      currency: course.currency || "INR",
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      rating: course.rating,
      enrollmentCount: course.enrollmentCount || 0,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  },

  // Format price for display
  formatPrice: (price, currency = "INR") => {
    if (currency === "INR") {
      return `₹${Number(price).toLocaleString("en-IN")}`;
    }
    return `${currency} ${Number(price).toLocaleString()}`;
  },

  // Format duration for display
  formatDuration: (duration) => {
    if (duration < 60) {
      return `${duration} minutes`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  },

  // Get category display name
  getCategoryDisplayName: (category) => {
    const categoryMap = {
      programming: "Programming",
      "data-science": "Data Science",
      "web-development": "Web Development",
      "mobile-development": "Mobile Development",
      design: "Design",
      business: "Business",
      marketing: "Marketing",
      photography: "Photography",
      music: "Music",
      language: "Language",
      other: "Other",
    };
    return categoryMap[category] || category;
  },

  // Get level display name
  getLevelDisplayName: (level) => {
    return level?.charAt(0).toUpperCase() + level?.slice(1) || "Beginner";
  },
};

// Default export
export default courseService;
