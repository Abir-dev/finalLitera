import express from "express";
import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  createCoinSetting,
  updateCoinSetting,
  deleteCoinSetting,
  listCoinSettings,
  assignCoinsToStudent,
  revokeCoinsFromStudent,
  getStudentWalletByAdmin,
  getUserWallet,
} from "../controllers/walletController.js";

const router = express.Router();

// Admin coin settings
router.post(
  "/admin/coins",
  adminAuth,
  requirePermission("settings"),
  createCoinSetting
);
router.get(
  "/admin/coins",
  adminAuth,
  requirePermission("settings"),
  listCoinSettings
);
router.put(
  "/admin/coins/:id",
  adminAuth,
  requirePermission("settings"),
  updateCoinSetting
);
router.delete(
  "/admin/coins/:id",
  adminAuth,
  requirePermission("settings"),
  deleteCoinSetting
);

// Admin wallet management for students
router.get(
  "/admin/students/:userId/wallet",
  adminAuth,
  getStudentWalletByAdmin
);
router.post(
  "/admin/students/:userId/wallet/assign",
  adminAuth,
  assignCoinsToStudent
);
router.post(
  "/admin/students/:userId/wallet/revoke",
  adminAuth,
  revokeCoinsFromStudent
);

// User wallet
router.get("/users/:id/wallet", protect, getUserWallet);

export default router;
