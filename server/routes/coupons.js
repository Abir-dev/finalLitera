import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createCoupon,
  validateCoupon,
  listCoupons,
  toggleCoupon,
  deleteCoupon,
  setCouponActive,
  generateCoupons,
} from "../controllers/couponController.js";

const router = express.Router();

// Public
router.get("/validate", validateCoupon);

// Admin
router.post("/", adminAuth, createCoupon);
router.post("/generate", adminAuth, generateCoupons);
router.get("/", adminAuth, listCoupons);
router.patch("/:id/toggle", adminAuth, toggleCoupon);
router.patch("/:id/active", adminAuth, setCouponActive);
router.delete("/:id", adminAuth, deleteCoupon);

export default router;


