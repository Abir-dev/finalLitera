import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    stipend: { type: String, default: "" },
    description: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    applyUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    applicationsCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
  },
  { timestamps: true }
);

internshipSchema.index({ name: 1, company: 1 });

export default mongoose.model("Internship", internshipSchema);


