import express from "express";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

// Debug endpoint to clear all enrollments (for testing only)
router.post("/clear-enrollments", async (req, res) => {
  try {
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

    res.status(200).json({
      status: "success",
      message: "All enrollments cleared successfully",
      data: {
        enrollmentsDeleted: enrollmentResult.deletedCount,
        usersModified: userResult.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Error clearing enrollments:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to clear enrollments",
      error: error.message,
    });
  }
});

export default router;
