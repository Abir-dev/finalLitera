import mongoose from "mongoose";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/finallitera"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Clear all enrollments for testing
const clearEnrollments = async () => {
  try {
    await connectDB();

    // Clear all enrollments from Enrollment collection
    const enrollmentResult = await Enrollment.deleteMany({});
    console.log(
      `Deleted ${enrollmentResult.deletedCount} enrollments from Enrollment collection`
    );

    // Clear all enrollments from User model
    const userResult = await User.updateMany(
      {},
      { $unset: { enrolledCourses: 1 } }
    );
    console.log(`Cleared enrollments from ${userResult.modifiedCount} users`);

    console.log("All enrollments cleared successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing enrollments:", error);
    process.exit(1);
  }
};

clearEnrollments();
