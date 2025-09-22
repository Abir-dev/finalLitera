import Internship from "../models/Internship.js";

export async function listInternships(req, res) {
  try {
    const internships = await Internship.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ status: "ok", data: { internships } });
  } catch (e) {
    console.error("listInternships error", e);
    return res.status(500).json({ status: "error", message: "Failed to fetch internships" });
  }
}

export async function createInternship(req, res) {
  try {
    const { name, company, role, stipend, description, contactNumber, contactEmail, applyUrl } = req.body || {};

    if (!name || !company || !role || !description || !contactNumber || !contactEmail) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const internship = await Internship.create({
      name,
      company,
      role,
      stipend: stipend || "",
      description,
      contactNumber,
      contactEmail,
      applyUrl: applyUrl || "",
      createdBy: req.admin?.id || null,
    });

    return res.status(201).json({ status: "ok", data: { internship } });
  } catch (e) {
    console.error("createInternship error", e);
    return res.status(500).json({ status: "error", message: "Failed to create internship" });
  }
}

export async function updateInternship(req, res) {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const internship = await Internship.findByIdAndUpdate(id, update, { new: true });
    if (!internship) return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", data: { internship } });
  } catch (e) {
    console.error("updateInternship error", e);
    return res.status(500).json({ status: "error", message: "Failed to update internship" });
  }
}

export async function deleteInternship(req, res) {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", message: "deleted" });
  } catch (e) {
    console.error("deleteInternship error", e);
    return res.status(500).json({ status: "error", message: "Failed to delete internship" });
  }
}

export async function applyInternship(req, res) {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndUpdate(
      id,
      { $inc: { applicationsCount: 1 } },
      { new: true }
    );
    if (!internship) return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", data: { internship } });
  } catch (e) {
    console.error("applyInternship error", e);
    return res.status(500).json({ status: "error", message: "Failed to apply" });
  }
}


