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

    // Prepare base order options early so promo code block can safely attach notes
    let orderOptions = {
      amount: undefined, // set after discounts
      currency: course.currency || "INR",
      receipt: undefined, // set below
      notes: { courseId: String(course._id), userId: String(req.user.id) },
    };

    // Apply promo code if provided
    if (promoCode) {
      try {
        const { default: Coupon } = await import("../models/Coupon.js");
        const coupon = await Coupon.findOne({
          code: String(promoCode).trim().toUpperCase(),
          course: courseId,
          isActive: true,
        });
        if (coupon && !coupon.isExpired()) {
          appliedDiscount = Math.min(
            100,
            Math.max(0, Number(coupon.percentOff))
          );
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
          // Attach coupon to notes (orderOptions initialized earlier)
          orderOptions.notes = {
            ...orderOptions.notes,
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

    orderOptions.amount = amountInPaise;
    orderOptions.receipt = `c_${String(course._id).slice(-12)}_${Date.now()
      .toString()
      .slice(-8)}`;
    console.log("Order options:", orderOptions);

    const order = await razorInstance.orders.create(orderOptions);
    console.log("Razorpay order created successfully:", order.id);

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
          appliedCoupon: promoCode
            ? String(promoCode).trim().toUpperCase()
            : undefined,
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
    res.status(500).json({
      status: "error",
      message: "Failed to create order",
      details: error.message,
    });
  }
});

// Verify payment and create order
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
      couponCode,
      coinsUsed,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: "error",
        message: "Missing payment verification data",
      });
    }

    // Verify the payment signature (only if order_id is provided)
    if (razorpay_order_id) {
      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          status: "error",
          message: "Invalid payment signature",
        });
      }
    }

    // Get payment details from Razorpay
    const payment = await razorInstance.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({
        status: "error",
        message: "Payment not captured",
      });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Process coin deduction if coins were used
    if (coinsUsed && coinsUsed > 0) {
      try {
        const Wallet = (await import("../models/Wallet.js")).default;
        const WalletTransaction = (
          await import("../models/WalletTransaction.js")
        ).default;

        const wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) {
          return res.status(400).json({
            status: "error",
            message: "User wallet not found",
          });
        }

        if (wallet.balance < coinsUsed) {
          return res.status(400).json({
            status: "error",
            message: "Insufficient coin balance",
          });
        }

        // Deduct coins from wallet
        const balanceBefore = wallet.balance;
        wallet.balance -= coinsUsed;
        wallet.totalRevoked += coinsUsed;
        await wallet.save();

        // Create wallet transaction record
        await WalletTransaction.create({
          user: req.user.id,
          type: "purchase",
          amount: coinsUsed,
          balanceBefore,
          balanceAfter: wallet.balance,
          course: courseId,
          metadata: {
            reason: "Course purchase",
            orderId: payment.id,
            referenceId: razorpay_payment_id,
          },
          status: "completed",
        });

        console.log(
          `Deducted ${coinsUsed} coins from user ${req.user.id} for course ${courseId}`
        );
      } catch (coinError) {
        console.error("Error processing coin deduction:", coinError);
        return res.status(500).json({
          status: "error",
          message: "Failed to process coin deduction",
        });
      }
    }

    // Create enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        user: req.user.id,
        course: courseId,
        status: "active",
        payment: {
          amount: payment.amount / 100,
          currency: payment.currency || "INR",
          paymentMethod: payment.method,
          transactionId: payment.id,
          paidAt: new Date(payment.created_at * 1000),
          coinsUsed: coinsUsed || 0,
        },
      },
      { upsert: true, new: true }
    );

    // Add to User model's enrolledCourses array
    const user = await User.findById(req.user.id);
    if (user && !user.isEnrolledInCourse(courseId)) {
      await user.enrollInCourse(courseId);
    }

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: "enrollment",
      title: "Course Enrollment Successful",
      message: `You have successfully enrolled in ${course.title}`,
      data: { courseId, enrollmentId: enrollment._id },
    });

    res.status(200).json({
      status: "success",
      message: "Payment verified and enrollment created",
      data: {
        enrollment,
        course: {
          id: course._id,
          title: course.title,
        },
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Payment verification failed",
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

      // Only proceed for actual captured payments
      if (event.event === "payment.captured") {
        console.log("Payment captured webhook received:", event);
        const paymentEntity = event.payload?.payment?.entity || {};
        const notes = paymentEntity.notes || {};
        const courseId = notes.courseId;
        const userId = notes.userId;

        console.log("Webhook data:", { courseId, userId, paymentEntity });

        // Hard guards: require captured status and positive amount
        const isCaptured =
          Boolean(paymentEntity.captured) ||
          paymentEntity.status === "captured";
        const amountPaise = Number(paymentEntity.amount || 0);

        if (!isCaptured || amountPaise <= 0) {
          console.warn(
            "Ignoring webhook: payment not captured or zero amount",
            {
              isCaptured,
              amountPaise,
              paymentId: paymentEntity.id,
            }
          );
        } else if (courseId && userId) {
          console.log(
            "Processing enrollment for user:",
            userId,
            "course:",
            courseId
          );
          try {
            // Create or update enrollment as paid
            const enrollment = await Enrollment.findOneAndUpdate(
              { user: userId, course: courseId },
              {
                user: userId,
                course: courseId,
                status: "active",
                payment: {
                  amount: amountPaise / 100,
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
