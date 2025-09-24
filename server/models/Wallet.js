import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAssigned: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevoked: {
      type: Number,
      default: 0,
      min: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

walletSchema.methods.credit = async function (
  amount,
  performedBy,
  metadata = {}
) {
  if (amount <= 0) throw new Error("Amount must be positive");
  const WalletTransaction = (await import("./WalletTransaction.js")).default;

  const balanceBefore = this.balance;
  this.balance += amount;
  this.totalAssigned += amount;
  await this.save();

  await WalletTransaction.create({
    user: this.user,
    performedBy,
    type: "assign",
    amount,
    balanceBefore,
    balanceAfter: this.balance,
    metadata,
    status: "completed",
  });

  return this;
};

walletSchema.methods.debit = async function (
  amount,
  performedBy,
  metadata = {}
) {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (this.balance < amount) throw new Error("Insufficient wallet balance");
  const WalletTransaction = (await import("./WalletTransaction.js")).default;

  const balanceBefore = this.balance;
  this.balance -= amount;
  this.totalRevoked += amount;
  await this.save();

  await WalletTransaction.create({
    user: this.user,
    performedBy,
    type: "revoke",
    amount,
    balanceBefore,
    balanceAfter: this.balance,
    metadata,
    status: "completed",
  });

  return this;
};

export default mongoose.model("Wallet", walletSchema);
