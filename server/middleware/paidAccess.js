import Enrollment from "../models/Enrollment.js";

// Require that the authenticated user has at least one paid course enrollment
export const requirePaidEnrollment = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    const userId = req.user.id;

    // Check for any active enrollment with payment recorded
    const hasPaid = await Enrollment.exists({
      user: userId,
      status: { $in: ["active", "completed"] },
      $or: [
        { "payment.paidAt": { $ne: null } },
        { "payment.amount": { $gt: 0 } },
        { "payment.transactionId": { $exists: true, $ne: null } },
      ],
    });

    if (!hasPaid) {
      return res.status(403).json({
        status: "error",
        message: "Access denied: internships available only to paid students",
      });
    }

    next();
  } catch (error) {
    console.error("requirePaidEnrollment error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};


