import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Debug Razorpay configuration
console.log("Razorpay Config:", {
  key_id: process.env.RAZORPAY_KEY_ID ? "Present" : "Missing",
  key_secret: process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing"
});

// Test authentication endpoint
router.get("/test-auth", protect, async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Authentication working",
    user: { id: req.user.id, email: req.user.email },
  });
});

// Test endpoint without authentication
router.get("/test-no-auth", async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "No auth endpoint working",
    headers: req.headers,
    cookies: req.cookies,
  });
});

// Create order for a course
router.post("/create-order", protect, async (req, res) => {
  try {
    console.log("Create order request received:", {
      userId: req.user?.id,
      userEmail: req.user?.email,
      body: req.body,
    });

    const { courseId } = req.body;
    if (!courseId) {
      return res
        .status(400)
        .json({ status: "error", message: "Course ID is required" });
    }

    console.log("Finding course with ID:", courseId);
    const course = await Course.findById(courseId);
    console.log("Course found:", course ? "Yes" : "No");
    
    if (!course || !course.isPublished) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not available" });
    }

    const amountInPaise = Math.round(Number(course.price) * 100);
    console.log("Creating Razorpay order with amount:", amountInPaise);
    
    const orderOptions = {
      amount: amountInPaise,
      currency: course.currency || "INR",
      receipt: `c_${String(course._id).slice(-12)}_${Date.now().toString().slice(-8)}`,
      notes: { courseId: String(course._id), userId: String(req.user.id) },
    };
    console.log("Order options:", orderOptions);
    
    const order = await razorInstance.orders.create(orderOptions);
    console.log("Razorpay order created successfully:", order.id);

    res.status(200).json({
      status: "success",
      data: {
        order,
        course: {
          title: course.title,
          price: course.price,
          originalPrice: course.originalPrice,
          currency: course.currency || "INR",
        },
      },
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      description: error.description
    });
    res
      .status(500)
      .json({ status: "error", message: "Failed to create order", details: error.message });
  }
});

// Razorpay webhook to verify payment and enroll user
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
      const signature = req.headers["x-razorpay-signature"];
      const body = req.body; // raw buffer is used by express.raw; but here we used type to preserve

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

      if (!signature || expectedSignature !== signature) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid signature" });
      }

      const event = JSON.parse(req.body.toString());
      if (event.event === "payment.captured" || event.event === "order.paid") {
        const notes =
          event.payload?.payment?.entity?.notes ||
          event.payload?.order?.entity?.notes ||
          {};
        const courseId = notes.courseId;
        const userId = notes.userId;
        const paymentEntity = event.payload?.payment?.entity || {};

        if (courseId && userId) {
          try {
            await Enrollment.findOneAndUpdate(
              { user: userId, course: courseId },
              {
                user: userId,
                course: courseId,
                status: "active",
                payment: {
                  amount: paymentEntity.amount / 100,
                  currency: paymentEntity.currency || "INR",
                  paymentMethod: paymentEntity.method,
                  transactionId: paymentEntity.id,
                  paidAt: new Date(paymentEntity.created_at * 1000),
                },
              },
              { upsert: true, new: true }
            );
          } catch (err) {
            console.error("Enrollment upsert error:", err);
          }
        }
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ status: "error" });
    }
  }
);

export default router;
