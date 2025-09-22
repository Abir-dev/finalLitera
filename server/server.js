import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import courseRoutes from "./routes/courses.js";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";
import adminRoutes from "./routes/admin.js";
import adminCourseRoutes from "./routes/adminCourses.js";
import paymentRoutes from "./routes/payment.js";
import examRoutes from "./routes/exams.js";
import liveClassRoutes from "./routes/liveClasses.js";
import notificationRoutes from "./routes/notification.js";
import internshipRoutes from "./routes/internships.js";
import connectCloudinary from "./utils/cloudinary.js";

// Import Admin model
import Admin from "./models/Admin.js";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "https://litera.in",
      "https://www.litera.in",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
  }
});

// Attach io for controllers to use
app.set('io', io);

io.on('connection', (socket) => {
  // Optional: client can authenticate and join their room
  socket.on('register_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });
});
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// --- SECURITY MIDDLEWARE ---
app.use(helmet()); // set security headers
app.use(compression()); // gzip compression
app.use(cookieParser()); // parse cookies

// --- RATE LIMITING ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // max requests per IP (increased for development)
  message: "Too many requests from this IP, please try again later.",
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === "development";
  },
});
app.use("/api/", limiter);

// --- CORS CONFIGURATION ---
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "https://litera.in",
      "https://www.litera.in",
      process.env.CLIENT_URL,
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "x-rtb-fingerprint-id",
  ],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false,
};

app.use(cors(corsOptions));

// --- BODY PARSING ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- LOGGING ---
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- MONGODB CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create admin account if it doesn't exist
    await createAdminIfNotExists();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// --- CREATE ADMIN ACCOUNT ---
const createAdminIfNotExists = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (!existingAdmin) {
      const admin = new Admin({
        firstName: "Rahul",
        lastName: "Admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        isActive: true,
        permissions: {
          userManagement: true,
          courseManagement: true,
          analytics: true,
          settings: true,
          notifications: true,
        },
        profile: {
          bio: "System Administrator",
          department: "IT",
          position: "Admin",
        },
      });

      await admin.save();
      console.log("✅ Admin account created: rahul12@gmail.com");
    } else {
      console.log("✅ Admin account already exists: rahul12@gmail.com");
    }
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
  }
};

await connectDB();
await connectCloudinary();

// --- ROUTES ---
app.use("/api/auth", authRoutes); // Auth routes (register, login, logout, me)
app.use("/api/users", userRoutes); // User management routes
app.use("/api/courses", courseRoutes); // Courses routes
app.use("/api/dashboard", dashboardRoutes); // Dashboard routes
app.use("/api/upload", uploadRoutes); // File upload routes
app.use("/api/admin", adminRoutes); // Admin authentication and management routes
app.use("/api/admin/courses", adminCourseRoutes); // Admin course management routes
app.use("/api/payments", paymentRoutes); // Razorpay payment routes
app.use("/api/exams", examRoutes); // Exams routes
app.use("/api/live-classes", liveClassRoutes); // Live classes routes
app.use("/api/notifications", notificationRoutes); // Notifications routes
app.use("/api/internships", internshipRoutes); // Internships routes

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "LMS-kinG API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// --- 404 HANDLER ---
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 LMS-kinG Backend API ready!`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
