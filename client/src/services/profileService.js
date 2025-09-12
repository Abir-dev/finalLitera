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
  }
};

export default profileService;
