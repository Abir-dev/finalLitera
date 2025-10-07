import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { protect } from "../middleware/auth.js";
import { requirePaidEnrollment } from "../middleware/paidAccess.js";
import {
  listInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  applyInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  console.log("Internships test endpoint hit");
  res.json({ status: "ok", message: "Internships API is working" });
});

// Restricted: list internships (only for users with a paid enrollment)
router.get("/", protect, requirePaidEnrollment, listInternships);

// Restricted: track apply (must be paid student)
router.post("/:id/apply", protect, requirePaidEnrollment, applyInternship);

// Admin: create/update/delete
router.post("/", adminAuth, createInternship);
router.put("/:id", adminAuth, updateInternship);
router.delete("/:id", adminAuth, deleteInternship);

export default router;
