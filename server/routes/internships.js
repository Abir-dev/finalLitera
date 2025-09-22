import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { listInternships, createInternship, updateInternship, deleteInternship, applyInternship } from "../controllers/internshipController.js";

const router = express.Router();

// Public: list internships
router.get("/", listInternships);

// Public: track apply (optional auth).
router.post("/:id/apply", applyInternship);

// Admin: create/update/delete
router.post("/", adminAuth, createInternship);
router.put("/:id", adminAuth, updateInternship);
router.delete("/:id", adminAuth, deleteInternship);

export default router;


