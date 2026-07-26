const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String, // e.g. IN, US, GB
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },

    emoji: {
      type: String, // 🇮🇳
      default: "",
    },

    continent: {
      type: String,
      default: "",
    },

    phoneCode: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "",
    },

    userCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    activeUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
