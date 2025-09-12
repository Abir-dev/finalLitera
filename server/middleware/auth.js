// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log("Invalid token in optional auth:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue even if there's an error
  }
};

// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - check if user is logged in
// server/middleware/auth.js
export const protect = async (req, res, next) => {
  try {
    let token;

    console.log("Auth middleware - Headers:", {
      authorization: req.headers.authorization,
      cookies: req.cookies,
      url: req.url,
      method: req.method,
    });

    // 1) Prefer cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
      console.log("Token found in cookie");
    }

    // 2) Fallback to Authorization header (Bearer)
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found in Authorization header");
    }

    if (!token) {
      console.log("No token found");
      return res
        .status(401)
        .json({ status: "error", message: "Not authorized" });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length in auth middleware:", process.env.JWT_SECRET?.length || 0);
    console.log("Token to verify:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", {
      id: decoded.id,
      email: decoded.email,
    });

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.log("User not found in database for ID:", decoded.id);
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }

    console.log("User found:", { id: req.user.id, email: req.user.email });

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "error", message: "Not authorized" });
  }
};

// Authorize routes - restrict by roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to access this route",
      });
    }

    next();
  };
};
