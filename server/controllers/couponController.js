import Coupon from "../models/Coupon.js";
import Course from "../models/Course.js";

// Helper to generate a random uppercase coupon code
function generateRandomCode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude easily confused chars
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out.toUpperCase();
}

async function generateUniqueCode() {
  // Ensure uniqueness globally (model has unique index on code)
  // Try a few times before failing
  for (let i = 0; i < 5; i++) {
    const candidate = generateRandomCode(8);
    const exists = await Coupon.findOne({ code: candidate }).lean();
    if (!exists) return candidate;
  }
  // Fallback with timestamp suffix
  return `${generateRandomCode(6)}${Date.now().toString().slice(-4)}`;
}

// Create a new coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, percentOff, courseId, expiresAt, usageLimit } = req.body || {};

    if (!percentOff) {
      return res.status(400).json({ status: "error", message: "percentOff is required" });
    }

    let resolvedCourseId = null;
    if (courseId && courseId !== "ALL") {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ status: "error", message: "Course not found" });
      resolvedCourseId = courseId;
    }

    const normalizedCode = code ? String(code).trim().toUpperCase() : await generateUniqueCode();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) return res.status(409).json({ status: "error", message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code: normalizedCode,
      percentOff,
      course: resolvedCourseId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: req.admin?.id,
      usageLimit: usageLimit ? Number(usageLimit) : null,
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

    const normalizedCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({
      code: normalizedCode,
      isActive: true,
      $or: [
        { course: null }, // global coupon
        { course: courseId }, // course-specific coupon
      ],
    });
    if (!coupon) return res.status(404).json({ status: "error", message: "Invalid or inactive coupon" });
    if (coupon.isExpired()) return res.status(410).json({ status: "error", message: "Coupon expired" });
    if (coupon.isExhausted()) return res.status(410).json({ status: "error", message: "Coupon usage limit reached" });

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
    if (courseId === 'ALL') {
      filter.course = null;
    } else if (courseId) {
      filter.course = courseId;
    }
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

// Explicitly activate/deactivate a coupon (Admin)
export const setCouponActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body || {};
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ status: "error", message: "isActive boolean is required" });
    }
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );
    if (!coupon) return res.status(404).json({ status: "error", message: "Coupon not found" });
    res.status(200).json({ status: "success", data: { coupon } });
  } catch (error) {
    console.error("Set coupon active error:", error);
    res.status(500).json({ status: "error", message: "Failed to update coupon" });
  }
};

// Generate one or more coupons (Admin)
export const generateCoupons = async (req, res) => {
  try {
    const { percentOff, courseId, expiresAt, count, usageLimit } = req.body || {};
    const qty = Math.min(100, Math.max(1, Number(count || 1)));
    if (!percentOff || !courseId) {
      return res.status(400).json({ status: "error", message: "percentOff and courseId are required" });
    }

    let resolvedCourseId = null;
    if (courseId && courseId !== "ALL") {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ status: "error", message: "Course not found" });
      resolvedCourseId = courseId;
    }

    const created = [];
    for (let i = 0; i < qty; i++) {
      const code = await generateUniqueCode();
      const coupon = await Coupon.create({
        code,
        percentOff,
        course: resolvedCourseId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        createdBy: req.admin?.id,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      });
      created.push(coupon);
    }

    res.status(201).json({ status: "success", data: { coupons: created } });
  } catch (error) {
    console.error("Generate coupons error:", error);
    res.status(500).json({ status: "error", message: "Failed to generate coupons" });
  }
};


