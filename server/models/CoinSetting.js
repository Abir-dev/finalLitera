import mongoose from "mongoose";

const coinSettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "LIT Coin",
    },
    symbol: {
      type: String,
      default: "LIT",
    },
    // Conversion configuration: how coins map to currency amount for discounts
    coinToCurrencyRate: {
      type: Number,
      default: 1, // 1 coin == 1 currency unit by default
      min: 0,
    },
    maxDiscountPercentPerPurchase: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    isMintingEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CoinSetting", coinSettingSchema);
