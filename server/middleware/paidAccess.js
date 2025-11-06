import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

// Require that the authenticated user has at least one paid course enrollment
export const requirePaidEnrollment = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    const userId = req.user.id;

    // Check for any active enrollment with payment recorded in Enrollment collection
    const hasPaidEnrollment = await Enrollment.exists({
      user: userId,
      status: { $in: ["active", "completed"] },
      $or: [
        { "payment.paidAt": { $ne: null } },
        { "payment.amount": { $gt: 0 } },
        { "payment.transactionId": { $exists: true, $ne: null } },
      ],
    });

    if (hasPaidEnrollment) {
      return next();
    }

    // Fallback: Check if user has enrolledCourses in User model (admin-assigned courses)
    // Admin-assigned courses are considered paid even if Enrollment document doesn't exist yet
    const user = await User.findById(userId).select("enrolledCourses");
    if (user && user.enrolledCourses && user.enrolledCourses.length > 0) {
      // User has enrolled courses (likely admin-assigned), grant access
      return next();
    }

    // No paid enrollment found
    return res.status(403).json({
      status: "error",
      message: "Access denied: internships available only to paid students",
    });
  } catch (error) {
    console.error("requirePaidEnrollment error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};


