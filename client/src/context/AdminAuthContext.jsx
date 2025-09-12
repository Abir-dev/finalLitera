import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  // Prefer env if provided; accept VITE_API_URL with or without /api suffix
  const apiEnv = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const normalizedApi = apiEnv.endsWith("/api")
    ? apiEnv
    : `${apiEnv.replace(/\/$/, "")}/api`;
  const backendURL = normalizedApi.replace(/\/api$/, "");

  const http = axios.create({
    baseURL: backendURL,
    timeout: 15000,
    withCredentials: true, // Include cookies in requests
    headers: { "Content-Type": "application/json" },
  });

  // Fetch current admin on load
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await http.get(`/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data.data.admin);
      } catch (err) {
        console.error(
          "Admin fetch error:",
          err?.response?.data || err?.message || err
        );
        // If token is invalid, remove it
        localStorage.removeItem("adminToken");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // --- ADMIN LOGIN ---
  const adminLogin = async (email, password) => {
    try {
      const res = await http.post(`/api/admin/login`, { email, password });

      const { admin: adminData, token } = res.data.data;

      // Store admin token separately from user token
      localStorage.setItem("adminToken", token);
      setAdmin(adminData);

      return res.data;
    } catch (error) {
      console.error(
        "Admin login error:",
        error?.response?.data || error?.message || error
      );
      throw error; // Re-throw to let the component handle it
    }
  };

  // --- ADMIN LOGOUT ---
  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  // --- UPDATE ADMIN PROFILE ---
  const updateAdminProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await http.put(`/api/admin/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmin(res.data.data.admin);
      return res.data;
    } catch (error) {
      console.error(
        "Update admin profile error:",
        error?.response?.data || error?.message || error
      );
      throw error;
    }
  };

  // --- CHANGE ADMIN PASSWORD ---
  const changeAdminPassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await http.put(
        `/api/admin/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    } catch (error) {
      console.error(
        "Change admin password error:",
        error?.response?.data || error?.message || error
      );
      throw error;
    }
  };

  // --- VERIFY ADMIN TOKEN ---
  const verifyAdminToken = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return false;

      const res = await http.get(`/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.status === "success";
    } catch (error) {
      console.error(
        "Admin token verification error:",
        error?.response?.data || error?.message || error
      );
      return false;
    }
  };

  // --- CHECK ADMIN PERMISSION ---
  const hasPermission = (permission) => {
    if (!admin || !admin.permissions) return false;
    return admin.permissions[permission] === true;
  };

  // --- GET ADMIN FULL NAME ---
  const getAdminFullName = () => {
    if (!admin) return "";
    return `${admin.firstName} ${admin.lastName}`;
  };

  // --- IS SUPER ADMIN ---
  const isSuperAdmin = () => {
    return admin && admin.role === "superadmin";
  };

  const value = {
    admin,
    setAdmin,
    loading,
    adminLogin,
    adminLogout,
    updateAdminProfile,
    changeAdminPassword,
    verifyAdminToken,
    hasPermission,
    getAdminFullName,
    isSuperAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
