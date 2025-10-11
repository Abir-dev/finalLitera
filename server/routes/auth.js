import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

// Make sure environment variables are loaded
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// Debug logging for JWT_SECRET
// console.log("Auth routes - JWT_SECRET loaded:", JWT_SECRET ? "Present" : "Missing");
// console.log("Auth routes - JWT_SECRET length:", JWT_SECRET?.length || 0);
// console.log("Auth routes - JWT_SECRET value:", JWT_SECRET);

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({ firstName, lastName, email, password });
    await user.save();
    
    // Ensure referral code is generated
    if (!user.referralCode) {
      await user.generateReferralCode();
    }

    let referralLinked = false;
    let referrerInfo = null;

    // Link referral if referralCode is provided
    if (referralCode) {
      try {
        const referrer = await User.findOne({ referralCode: String(referralCode).trim().toUpperCase() });
        if (referrer && String(referrer._id) !== String(user._id)) {
          user.referredBy = referrer._id;
          await user.save();
          
          // Increment referrer invite count
          referrer.referral = referrer.referral || {};
          referrer.referral.totalInvites = (referrer.referral.totalInvites || 0) + 1;
          await referrer.save();
          
          referralLinked = true;
          referrerInfo = {
            name: `${referrer.firstName} ${referrer.lastName}`,
            referralCode: referrer.referralCode
          };
        }
      } catch (refErr) {
        console.warn("Failed to link referral on signup:", refErr?.message);
      }
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(201).json({
      user: { 
        id: user._id, 
        firstName, 
        lastName, 
        email, 
        role: user.role, 
        referralCode: user.referralCode,
        referredBy: user.referredBy
      },
      token,
      referralLinked,
      referrerInfo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    console.log("Login - Generated token with JWT_SECRET length:", JWT_SECRET?.length);

    res.status(200).json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatar: user.avatar },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- VALIDATE REFERRAL CODE ---
router.post("/validate-referral", async (req, res) => {
  try {
    const { referralCode, userId } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ 
        valid: false, 
        message: "Referral code is required" 
      });
    }

    const referrer = await User.findOne({ 
      referralCode: String(referralCode).trim().toUpperCase() 
    }).select("firstName lastName referralCode _id");

    if (!referrer) {
      return res.status(404).json({ 
        valid: false, 
        message: "Invalid referral code" 
      });
    }

    // Check if user is trying to use their own referral code
    if (userId && String(referrer._id) === String(userId)) {
      return res.status(400).json({ 
        valid: false, 
        message: "Cannot use your own referral code" 
      });
    }

    // Check if user has already used a referral discount
    if (userId) {
      const user = await User.findById(userId).select("referralDiscountUsed");
      if (user && user.referralDiscountUsed) {
        return res.status(400).json({ 
          valid: false, 
          message: "You have already used a referral discount" 
        });
      }
    }

    res.status(200).json({
      valid: true,
      referrer: {
        name: `${referrer.firstName} ${referrer.lastName}`,
        referralCode: referrer.referralCode,
        id: referrer._id
      },
      discount: {
        percentOff: 10,
        type: "referral",
        description: "10% discount on your first purchase"
      }
    });
  } catch (err) {
    console.error("Validate referral error:", err);
    res.status(500).json({ 
      valid: false, 
      message: "Server error" 
    });
  }
});

// --- APPLY REFERRAL DISCOUNT ---
router.post("/apply-referral-discount", async (req, res) => {
  try {
    const { referralCode, userId } = req.body;
    
    if (!referralCode || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Referral code and user ID are required" 
      });
    }

    // Find the referrer
    const referrer = await User.findOne({ 
      referralCode: String(referralCode).trim().toUpperCase() 
    });

    if (!referrer) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid referral code" 
      });
    }

    // Find the user applying the discount
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user is trying to use their own referral code
    if (String(referrer._id) === String(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot use your own referral code" 
      });
    }

    // Check if user has already used a referral discount
    if (user.referralDiscountUsed) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already used a referral discount" 
      });
    }

    // Apply the referral discount
    user.referralDiscountUsed = true;
    user.referredBy = referrer._id;
    await user.save();

    // Update referrer's stats
    referrer.referral = referrer.referral || {};
    referrer.referral.totalInvites = (referrer.referral.totalInvites || 0) + 1;
    await referrer.save();

    res.status(200).json({
      success: true,
      message: "Referral discount applied successfully",
      discount: {
        percentOff: 10,
        type: "referral",
        description: "10% discount on your first purchase"
      },
      referrer: {
        name: `${referrer.firstName} ${referrer.lastName}`,
        referralCode: referrer.referralCode
      }
    });
  } catch (err) {
    console.error("Apply referral discount error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// --- CHECK REFERRAL DISCOUNT ELIGIBILITY ---
router.get("/referral-discount-eligibility/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        eligible: false, 
        message: "User ID is required" 
      });
    }

    const user = await User.findById(userId).select("referralDiscountUsed referredBy");
    if (!user) {
      return res.status(404).json({ 
        eligible: false, 
        message: "User not found" 
      });
    }

    const eligible = !user.referralDiscountUsed;
    
    res.status(200).json({
      eligible,
      hasUsedReferralDiscount: user.referralDiscountUsed,
      referredBy: user.referredBy,
      message: eligible 
        ? "User is eligible for referral discount" 
        : "User has already used a referral discount"
    });
  } catch (err) {
    console.error("Check referral discount eligibility error:", err);
    res.status(500).json({ 
      eligible: false, 
      message: "Server error" 
    });
  }
});

// --- GET CURRENT USER ---
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
