import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const router = express.Router();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Debug Razorpay configuration
console.log("Razorpay Config:", {
  key_id: process.env.RAZORPAY_KEY_ID ? "Present" : "Missing",
  key_secret: process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing",
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

    const { courseId, promoCode } = req.body;
    if (!courseId) {
      return res
        .status(400)
        .json({ status: "error", message: "Course ID is required" });
    }

    // Enforce a single promo code per purchase
    if (Array.isArray(promoCode)) {
      return res.status(400).json({ status: "error", message: "Only one promo code can be applied" });
    }
    if (typeof promoCode === "string" && promoCode.includes(",")) {
      return res.status(400).json({ status: "error", message: "Only one promo code can be applied" });
    }

    console.log("Finding course with ID:", courseId);
    const course = await Course.findById(courseId);
    console.log("Course found:", course ? "Yes" : "No");

    if (!course || !course.isPublished) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not available" });
    }

    let price = Number(course.price);
    let appliedDiscount = 0;
    let couponNotes = {};

    // Apply promo code if provided
    if (promoCode) {
      try {
        const { default: Coupon } = await import("../models/Coupon.js");
        const coupon = await Coupon.findOne({
          code: String(promoCode).trim().toUpperCase(),
          isActive: true,
          $or: [
            { course: null },
            { course: courseId },
          ],
        });
        if (coupon && !coupon.isExpired() && !coupon.isExhausted()) {
          appliedDiscount = Math.min(100, Math.max(0, Number(coupon.percentOff)));
          const discounted = price * (1 - appliedDiscount / 100);
          price = Math.max(0, Math.round(discounted));
          // Increment usage count asynchronously
          try {
            coupon.usageCount = (coupon.usageCount || 0) + 1;
            if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
              coupon.isActive = false; // auto-expire on reaching limit
            }
            await coupon.save();
          } catch (incErr) {
            console.warn("Failed to increment coupon usage:", incErr?.message);
          }
          // Prepare coupon notes (attach later when orderOptions is created)
          couponNotes = {
            couponCode: coupon.code,
            discountPercent: appliedDiscount,
          };
        }
      } catch (e) {
        console.warn("Promo code apply failed:", e?.message);
      }
    }

    const amountInPaise = Math.round(price * 100);
    console.log("Creating Razorpay order with amount:", amountInPaise);

    const orderOptions = {
      amount: amountInPaise,
      currency: course.currency || "INR",
      receipt: `c_${String(course._id).slice(-12)}_${Date.now()
        .toString()
        .slice(-8)}`,
      notes: { courseId: String(course._id), userId: String(req.user.id), ...couponNotes },
    };
    console.log("Order options:", orderOptions);

    const order = await razorInstance.orders.create(orderOptions);
    console.log("Razorpay order created successfully:", order.id);

    // Check if user is already enrolled in this course
    const user = await User.findById(req.user.id);
    if (user.isEnrolledInCourse(courseId)) {
      return res.status(400).json({
        status: "error",
        message: "Already enrolled in this course"
      });
    }

    // Create enrollment record in Enrollment collection
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        user: req.user.id,
        course: courseId,
        status: "active",
        payment: {
          amount: course.price,
          currency: course.currency || "INR",
          paymentMethod: "razorpay",
          transactionId: order.id,
          paidAt: null, // Will be updated when payment is captured
        },
      },
      { upsert: true, new: true }
    );

    // Add enrollment to User model's enrolledCourses array for backward compatibility
    if (!user.isEnrolledInCourse(courseId)) {
      await user.enrollInCourse(courseId);
      console.log("Added enrollment to User model for user:", req.user.id);
    }

    // Increment course enrollment count
    await course.incrementEnrollment();

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'course_enrollment',
      title: 'Course Enrollment Confirmed',
      message: `You have successfully enrolled in "${course.title}"`,
      data: { courseId: course._id, enrollmentId: enrollment._id }
    });

    console.log("Enrollment created successfully:", enrollment._id);

    res.status(200).json({
      status: "success",
      data: {
        order,
        course: {
          title: course.title,
          price: price,
          originalPrice: course.originalPrice,
          currency: course.currency || "INR",
          discountPercent: appliedDiscount,
          appliedCoupon: promoCode ? String(promoCode).trim().toUpperCase() : undefined,
        },
        enrollment: {
          id: enrollment._id,
          status: enrollment.status,
        },
      },
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      description: error.description,
    });
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to create order",
        details: error.message,
      });
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
            // Create enrollment in Enrollment collection
            const enrollment = await Enrollment.findOneAndUpdate(
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

            // Also add to User model's enrolledCourses array for backward compatibility
            const User = (await import("../models/User.js")).default;
            const user = await User.findById(userId);
            if (user && !user.isEnrolledInCourse(courseId)) {
              await user.enrollInCourse(courseId);
              console.log("Added enrollment to User model for user:", userId);
            }

            console.log("Enrollment created successfully:", enrollment._id);
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
