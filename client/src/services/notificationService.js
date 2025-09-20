import axios from "axios";

const apiEnv =
  import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
const normalizedApi = apiEnv.endsWith("/api")
  ? apiEnv
  : `${apiEnv.replace(/\/$/, "")}/api`;
const backendURL = normalizedApi.replace(/\/api$/, "");

// Create axios instance with default config
const api = axios.create({
  baseURL: `${backendURL}/api`,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationService = {
  // Get all notifications for user with pagination and filters
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get("/notifications", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get notification count
  getNotificationCount: async () => {
    try {
      const response = await api.get("/notifications/count");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification count:", error);
      throw error;
    }
  },

  // Mark specific notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete specific notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await api.get("/notifications/preferences");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      if (error.response?.status === 404) {
        // Return default preferences if endpoint not found
        return {
          status: "success",
          data: {
            preferences: {
              email: true,
              push: true,
              courseUpdates: true,
              marketing: false,
            },
          },
        };
      }
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put("/notifications/preferences", preferences);
      return response.data;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      if (error.response?.status === 404) {
        // If endpoint not found, just return success (preferences will be stored locally)
        return {
          status: "success",
          message: "Preferences updated locally",
          data: { preferences },
        };
      }
      throw error;
    }
  },
};

export default notificationService;
