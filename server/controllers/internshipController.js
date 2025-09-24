import Internship from "../models/Internship.js";

export async function listInternships(req, res) {
  try {
    console.log("listInternships called");
    const internships = await Internship.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName email")
      .lean();

    console.log("Found internships:", internships.length);
    const response = { status: "ok", data: { internships } };
    console.log("Sending response:", response);

    return res.json(response);
  } catch (e) {
    console.error("listInternships error", e);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch internships",
      error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
  }
}

export async function createInternship(req, res) {
  try {
    console.log("createInternship called with body:", req.body);
    console.log("Admin info:", req.admin);

    const {
      name,
      company,
      role,
      stipend,
      description,
      contactNumber,
      contactEmail,
      applyUrl,
    } = req.body || {};

    // Validate required fields
    if (
      !name ||
      !company ||
      !role ||
      !description ||
      !contactNumber ||
      !contactEmail
    ) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        details: {
          name: !name ? "Name is required" : null,
          company: !company ? "Company is required" : null,
          role: !role ? "Role is required" : null,
          description: !description ? "Description is required" : null,
          contactNumber: !contactNumber ? "Contact number is required" : null,
          contactEmail: !contactEmail ? "Contact email is required" : null,
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      console.log("Validation failed - invalid email format");
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    console.log("Creating internship with data:", {
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      stipend: stipend ? stipend.trim() : "",
      description: description.trim(),
      contactNumber: contactNumber.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      applyUrl: applyUrl ? applyUrl.trim() : "",
      createdBy: req.admin?.id || null,
    });

    const internship = await Internship.create({
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      stipend: stipend ? stipend.trim() : "",
      description: description.trim(),
      contactNumber: contactNumber.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      applyUrl: applyUrl ? applyUrl.trim() : "",
      createdBy: req.admin?.id || null,
    });

    console.log("Internship created successfully:", internship);
    const response = { status: "ok", data: { internship } };
    console.log("Sending response:", response);

    return res.status(201).json(response);
  } catch (e) {
    console.error("createInternship error", e);

    // Handle specific MongoDB errors
    if (e.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        details: e.errors,
      });
    }

    if (e.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Duplicate entry found",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create internship",
      error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
  }
}

export async function updateInternship(req, res) {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const internship = await Internship.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!internship)
      return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", data: { internship } });
  } catch (e) {
    console.error("updateInternship error", e);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to update internship" });
  }
}

export async function deleteInternship(req, res) {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship)
      return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", message: "deleted" });
  } catch (e) {
    console.error("deleteInternship error", e);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete internship" });
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
    if (!internship)
      return res.status(404).json({ status: "error", message: "Not found" });
    return res.json({ status: "ok", data: { internship } });
  } catch (e) {
    console.error("applyInternship error", e);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to apply" });
  }
}
