const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

/* ---------------------------------- User --------------------------------- */

const locationSchema = new Schema(
  {
    city: String,
    country: String,
    point: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailId: { type: String, lowercase: true, trim: true },
    password: { type: String },
    passwordHash: { type: String, select: false },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: "" },
    dob: { type: Date },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0, default: 0 },

    gender: {
      type: String,
      enum: ["male", "female", "non_binary", "non-binary", "other", ""],
      default: "",
    },
    genderPreference: {
      type: [String],
      default: [],
    },

    occupation: { type: String, trim: true, default: "" },
    education: { type: String, trim: true, default: "" },
    currentRole: { type: String, default: "" },
    company: { type: String, default: "" },
    bio: { type: String, maxlength: 500, default: "" },

    photos: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },

    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },

    relationshipGoal: {
      type: String,
      default: "",
    },
    drinking: {
      type: String,
      default: "",
    },
    smoking: {
      type: String,
      default: "",
    },

    location: {
      type: mongoose.Schema.Types.Mixed,
      default: "Earth",
    },

    isVerified: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },

    // Users this profile has hidden/rejected from future recommendations.
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ "location.point": "2dsphere" });

userSchema.pre("save", function (next) {
  if (this.dob || this.dateOfBirth) {
    const targetDob = this.dob || this.dateOfBirth;
    const diffMs = Date.now() - new Date(targetDob).getTime();
    this.age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  }
  if (!this.emailId && this.email) {
    this.emailId = this.email;
  }
  if (!this.email && this.emailId) {
    this.email = this.emailId;
  }
  if (!this.passwordHash && this.password) {
    this.passwordHash = this.password;
  }
  next();
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET || "Dev@tarun", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const targetHash = user.password || user.passwordHash;
  if (!targetHash) return false;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    targetHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

/* ---------------------------------- Swipe -------------------------------- */

const swipeSchema = new Schema(
  {
    swiper: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["like", "pass", "super_like"], required: true },
  },
  { timestamps: true }
);

swipeSchema.index({ swiper: 1, target: 1 }, { unique: true });

const Swipe = mongoose.model("Swipe", swipeSchema);

/* ---------------------------------- Match -------------------------------- */

const matchSchema = new Schema(
  {
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: (v) => v.length === 2,
      required: true,
    },
    matchScore: { type: Number, min: 0, max: 100 },
    compatibilityBreakdown: {
      sharedInterests: { type: Number, min: 0, max: 100 },
      locationFit: { type: Number, min: 0, max: 100 },
      goalAlignment: { type: Number, min: 0, max: 100 },
    },
    matchedAt: { type: Date, default: Date.now },
    lastMessageAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

matchSchema.index({ users: 1 });

const Match = mongoose.model("Match", matchSchema);

/* --------------------------------- Message -------------------------------- */

const messageSchema = new Schema(
  {
    match: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    readAt: Date,
  },
  { timestamps: true }
);

messageSchema.index({ match: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

// Export User model directly as default export, with named exports attached
module.exports = User;
module.exports.User = User;
module.exports.Swipe = Swipe;
module.exports.Match = Match;
module.exports.Message = Message;