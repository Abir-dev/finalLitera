import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoinSetting",
      default: null,
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user id when admin performs
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "mint", // admin created new coins into the system
        "assign", // admin assigned coins to a student
        "revoke", // admin took back coins from a student
        "purchase", // student used coins towards a course purchase
        "refund", // refund coins back to student
        "adjustment", // manual balance correction
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    metadata: {
      reason: { type: String },
      notes: { type: String },
      orderId: { type: String },
      referenceId: { type: String },
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "reversed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });
walletTransactionSchema.index({ type: 1, createdAt: -1 });
walletTransactionSchema.index({ coin: 1, createdAt: -1 });

export default mongoose.model("WalletTransaction", walletTransactionSchema);
