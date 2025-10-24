import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
  const normalizedApi = apiEnv.endsWith("/api")
  //   ? apiEnv
  //   : `${apiEnv.replace(/\/$/, "")}/api`;
  // const backendURL = normalizedApi.replace(/\/api$/, "");
  const backendURL = apiEnv
  const http = axios.create({
    baseURL: backendURL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Include cookies in requests
  });

  // Socket connection for real-time notifications
  useEffect(() => {
    let socket;
    
    // Only attempt socket connection if user is logged in
    if (!user?.id && !user?._id) return;
    
    try {
      socket = io(backendURL, {
        withCredentials: true,
        path: '/socket.io',
        transports: ['websocket', 'polling'], // Add polling as fallback
        reconnectionAttempts: 3, // Reduce attempts
        reconnectionDelay: 2000,
        timeout: 10000,
        forceNew: true,
      });

      // Add error handling for socket events
      socket.on('connect', () => {
        console.log('Socket connected successfully');
        if (user?.id || user?._id) {
          socket.emit('register_user', user.id || user._id);
        }
      });

      socket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message);
        // Don't spam console with connection errors
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

    } catch (error) {
      console.warn('Failed to initialize socket:', error.message);
    }
    
    return () => {
      try { 
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect(); 
        }
      } catch (error) {
        console.warn('Error disconnecting socket:', error.message);
      }
    };
  }, [backendURL, user?.id, user?._id]);

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
