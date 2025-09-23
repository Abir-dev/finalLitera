import Coupon from "../models/Coupon.js";
import Course from "../models/Course.js";

// Create a new coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, percentOff, courseId, expiresAt } = req.body || {};

    if (!code || !percentOff || !courseId) {
      return res.status(400).json({ status: "error", message: "code, percentOff and courseId are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ status: "error", message: "Course not found" });

    const normalizedCode = String(code).trim().toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode, course: courseId });
    if (existing) return res.status(409).json({ status: "error", message: "Coupon code already exists for this course" });

    const coupon = await Coupon.create({
      code: normalizedCode,
      percentOff,
      course: courseId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: req.admin?.id,
    });

    res.status(201).json({ status: "success", data: { coupon } });
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({ status: "error", message: "Failed to create coupon" });
  }
};

// Validate coupon (Public)
export const validateCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.query || {};
    if (!code || !courseId) {
      return res.status(400).json({ status: "error", message: "code and courseId are required" });
    }

    const coupon = await Coupon.findOne({ code: String(code).trim().toUpperCase(), course: courseId, isActive: true });
    if (!coupon) return res.status(404).json({ status: "error", message: "Invalid or inactive coupon" });
    if (coupon.isExpired()) return res.status(410).json({ status: "error", message: "Coupon expired" });

    res.status(200).json({ status: "success", data: { percentOff: coupon.percentOff, expiresAt: coupon.expiresAt } });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({ status: "error", message: "Failed to validate coupon" });
  }
};

// List coupons (Admin)
export const listCoupons = async (req, res) => {
  try {
    const { courseId } = req.query || {};
    const filter = {};
    if (courseId) filter.course = courseId;
    const coupons = await Coupon.find(filter).populate("course", "title price").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { coupons } });
  } catch (error) {
    console.error("List coupons error:", error);
    res.status(500).json({ status: "error", message: "Failed to list coupons" });
  }
};

// Toggle coupon active state (Admin)
export const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ status: "error", message: "Coupon not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ status: "success", data: { coupon } });
  } catch (error) {
    console.error("Toggle coupon error:", error);
    res.status(500).json({ status: "error", message: "Failed to update coupon" });
  }
};

// Delete coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ status: "error", message: "Coupon not found" });
    await coupon.deleteOne();
    res.status(200).json({ status: "success", message: "Coupon deleted" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ status: "error", message: "Failed to delete coupon" });
  }
};


