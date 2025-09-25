import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percentOff: { type: Number, required: true, min: 1, max: 100 },
    // When null/undefined, coupon applies to all courses
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: false, default: null },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    usageCount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: null, min: 1 }, // optional max uses
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

couponSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

couponSchema.methods.isExhausted = function () {
  if (this.usageLimit == null) return false;
  return Number(this.usageCount || 0) >= Number(this.usageLimit);
};

export default mongoose.model("Coupon", couponSchema);


