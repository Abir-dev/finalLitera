import axios from 'axios';

const apiEnv = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const normalizedApi = apiEnv.endsWith("/api")
  ? apiEnv
  : `${apiEnv.replace(/\/$/, "")}/api`;
const backendURL = normalizedApi.replace(/\/api$/, "");

const http = axios.create({
  baseURL: backendURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Add auth token to requests
const getAuthToken = () => localStorage.getItem("token");

http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const profileService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await http.get('/api/users/profile/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await http.put('/api/users/profile/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await http.put('/api/users/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await http.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await http.get('/api/users/profile/me');
      const user = response.data.data.user;
      
      // Calculate stats from user data
      const stats = {
        enrolledCourses: user.enrolledCourses?.length || 0,
        completedCourses: user.enrolledCourses?.filter(course => course.progress === 100).length || 0,
        certificates: user.certificates?.length || 0,
        totalStudyTime: user.enrolledCourses?.reduce((total, course) => {
          // This would need to be calculated based on actual study time tracking
          return total + (course.progress || 0);
        }, 0) || 0,
        averageProgress: user.enrolledCourses?.length > 0 
          ? Math.round(user.enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / user.enrolledCourses.length)
          : 0
      };
      
      return { stats, user };
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  // Get enrolled courses with filtering
  getEnrolledCourses: async (filters = {}) => {
    try {
      const response = await http.get('/api/users/profile/me');
      const user = response.data.data.user;
      let enrolledCourses = user.enrolledCourses || [];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        enrolledCourses = enrolledCourses.filter(course => 
          course.course?.title?.toLowerCase().includes(searchTerm) ||
          course.course?.instructor?.firstName?.toLowerCase().includes(searchTerm) ||
          course.course?.instructor?.lastName?.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.category && filters.category !== 'all') {
        enrolledCourses = enrolledCourses.filter(course => 
          course.course?.category === filters.category
        );
      }
      
      if (filters.level && filters.level !== 'all') {
        enrolledCourses = enrolledCourses.filter(course => 
          course.course?.level === filters.level
        );
      }
      
      if (filters.progress) {
        switch (filters.progress) {
          case 'not-started':
            enrolledCourses = enrolledCourses.filter(course => course.progress === 0);
            break;
          case 'in-progress':
            enrolledCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
            break;
          case 'completed':
            enrolledCourses = enrolledCourses.filter(course => course.progress === 100);
            break;
        }
      }
      
      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'title-asc':
            enrolledCourses.sort((a, b) => a.course?.title?.localeCompare(b.course?.title) || 0);
            break;
          case 'title-desc':
            enrolledCourses.sort((a, b) => b.course?.title?.localeCompare(a.course?.title) || 0);
            break;
          case 'progress-asc':
            enrolledCourses.sort((a, b) => (a.progress || 0) - (b.progress || 0));
            break;
          case 'progress-desc':
            enrolledCourses.sort((a, b) => (b.progress || 0) - (a.progress || 0));
            break;
          case 'enrolled-date-asc':
            enrolledCourses.sort((a, b) => new Date(a.enrolledAt) - new Date(b.enrolledAt));
            break;
          case 'enrolled-date-desc':
            enrolledCourses.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
            break;
          case 'last-accessed-asc':
            enrolledCourses.sort((a, b) => new Date(a.lastAccessed) - new Date(b.lastAccessed));
            break;
          case 'last-accessed-desc':
            enrolledCourses.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
            break;
        }
      }
      
      return { enrolledCourses };
    } catch (error) {
      console.error('Get enrolled courses error:', error);
      throw error;
    }
  }
};

export default profileService;
