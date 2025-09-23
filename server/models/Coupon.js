import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percentOff: { type: Number, required: true, min: 1, max: 100 },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

couponSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

export default mongoose.model("Coupon", couponSchema);


