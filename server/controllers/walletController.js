import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import CoinSetting from "../models/CoinSetting.js";
import User from "../models/User.js";

async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0 });
  }
  return wallet;
}

export const createCoinSetting = async (req, res) => {
  try {
    const payload = req.body || {};
    const setting = await CoinSetting.create(payload);
    res.status(201).json({ status: "success", data: setting });
  } catch (error) {
    console.error("createCoinSetting error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create coin setting" });
  }
};

export const updateCoinSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await CoinSetting.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "Coin setting not found" });
    }
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    console.error("updateCoinSetting error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update coin setting" });
  }
};

export const deleteCoinSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CoinSetting.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Coin setting not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Coin setting deleted" });
  } catch (error) {
    console.error("deleteCoinSetting error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete coin setting" });
  }
};

export const listCoinSettings = async (_req, res) => {
  try {
    const settings = await CoinSetting.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: settings });
  } catch (error) {
    console.error("listCoinSettings error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to list coin settings" });
  }
};

export const assignCoinsToStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason, notes, coinId } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Amount must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });

    const wallet = await getOrCreateWallet(userId);

    let selectedCoin = null;
    if (coinId) {
      selectedCoin = await CoinSetting.findById(coinId);
      if (!selectedCoin) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid coinId" });
      }
    }

    const balanceBefore = wallet.balance;
    wallet.balance += amount;
    wallet.totalAssigned += amount;
    await wallet.save();

    await WalletTransaction.create({
      user: userId,
      performedBy: req.admin?.id || null,
      type: "assign",
      amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      coin: selectedCoin?._id || null,
      metadata: { reason, notes },
      status: "completed",
    });

    res
      .status(200)
      .json({ status: "success", message: "Coins assigned", data: wallet });
  } catch (error) {
    console.error("assignCoinsToStudent error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to assign coins" });
  }
};

export const revokeCoinsFromStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason, notes } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Amount must be greater than 0" });
    }

    const wallet = await getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ status: "error", message: "Insufficient wallet balance" });
    }

    const balanceBefore = wallet.balance;
    wallet.balance -= amount;
    wallet.totalRevoked += amount;
    await wallet.save();

    await WalletTransaction.create({
      user: userId,
      performedBy: req.admin?.id || null,
      type: "revoke",
      amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      metadata: { reason, notes },
      status: "completed",
    });

    res
      .status(200)
      .json({ status: "success", message: "Coins revoked", data: wallet });
  } catch (error) {
    console.error("revokeCoinsFromStudent error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to revoke coins" });
  }
};

export const getStudentWalletByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await getOrCreateWallet(userId);
    const transactions = await WalletTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ status: "success", data: { wallet, transactions } });
  } catch (error) {
    console.error("getStudentWalletByAdmin error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch wallet" });
  }
};

export const getUserWallet = async (req, res) => {
  try {
    const { id } = req.params; // user id
    if (req.user && req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    const wallet = await getOrCreateWallet(id);
    const transactions = await WalletTransaction.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ status: "success", data: { wallet, transactions } });
  } catch (error) {
    console.error("getUserWallet error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch wallet" });
  }
};
