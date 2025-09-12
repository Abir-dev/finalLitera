import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiEnv = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const normalizedApi = apiEnv.endsWith("/api")
    ? apiEnv
    : `${apiEnv.replace(/\/$/, "")}/api`;
  const backendURL = normalizedApi.replace(/\/api$/, "");
  const http = axios.create({
    baseURL: backendURL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Include cookies in requests
  });

  // Fetch current user on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await http.get(`/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const res = await http.post(`/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to let the component handle it
    }
  };

  // --- SIGNUP ---
  const signup = async (data) => {
    try {
      const res = await http.post(`/api/auth/signup`, data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Re-throw to let the component handle it
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
