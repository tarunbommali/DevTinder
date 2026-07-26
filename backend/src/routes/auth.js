const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const { ValidationSignUp } = require("../utils/validation");
const User = require("../models/user");

const formatAuthUserResponse = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  emailId: user.emailId || user.email,
  email: user.email || user.emailId,
  dateOfBirth: user.dateOfBirth,
  age: user.age,
  gender: user.gender,
  profilePicture: user.profilePicture || user.photos?.[0],
  photos: user.photos || [],
  bio: user.bio,
  highestQualification: user.highestQualification,
  company: user.company,
  collegeInstitution: user.collegeInstitution,
  currentRole: user.currentRole,
  totalExperience: user.totalExperience,
  skills: user.skills || [],
  interests: user.interests || [],
  languages: user.languages || [],
  location: user.location,
  occupation: user.occupation,
  education: user.education,
  drinking: user.drinking,
  smoking: user.smoking,
  workout: user.workout,
  pets: user.pets,
  religion: user.religion,
  relationshipGoal: user.relationshipGoal,
  preferences: user.preferences,
  profileCompleted: user.profileCompleted || false,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const Country = require("../models/country");

const updateCountryStats = async (locationData) => {
  try {
    if (!locationData) return;
    let countryName = "";
    let countryCode = "";

    if (typeof locationData === "object") {
      countryName = locationData.country || "";
      countryCode =
        locationData.countryCode ||
        (countryName ? countryName.substring(0, 2).toUpperCase() : "IN");
    } else if (typeof locationData === "string" && locationData.trim()) {
      countryName = locationData.trim();
      countryCode = countryName.substring(0, 2).toUpperCase();
    }

    if (!countryName) countryName = "India";
    if (!countryCode) countryCode = "IN";

    await Country.findOneAndUpdate(
      { code: countryCode.toUpperCase() },
      {
        $set: { name: countryName },
        $inc: { userCount: 1, activeUsers: 1 },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error updating country stats:", err.message);
  }
};

authRouter.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const countryCount = await Country.countDocuments();
    const distinctCountries = await User.distinct("location.country");
    const validCountries = distinctCountries.filter(Boolean).length;
    const finalCountryCount = Math.max(countryCount, validCountries, 1);

    res.status(200).json({
      totalUsers: Math.max(totalUsers, 1),
      activeUsers: Math.max(totalUsers, 1),
      countryCount: finalCountryCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ totalUsers: 1, activeUsers: 1, countryCount: 1 });
  }
});

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, email, password, location } = req.body;
  const targetEmail = (emailId || email || "").toLowerCase();

  try {
    const errors = ValidationSignUp({ ...req.body, emailId: targetEmail });

    const existingUser = await User.findOne({
      $or: [{ emailId: targetEmail }, { email: targetEmail }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const capitalize = (str) => {
      if (!str || typeof str !== "string") return "";
      const trimmed = str.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    };

    const newUser = new User({
      firstName: capitalize(firstName),
      lastName: capitalize(lastName || ""),
      emailId: targetEmail,
      email: targetEmail,
      password: hashedPassword,
      location: location || "Earth",
    });

    await newUser.save();
    await updateCountryStats(newUser.location);

    const token = await newUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: formatAuthUserResponse(newUser),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, email, password } = req.body;
  const targetEmail = (emailId || email || "").toLowerCase();

  try {
    const user = await User.findOne({
      $or: [{ emailId: targetEmail }, { email: targetEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: formatAuthUserResponse(user),
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

authRouter.post("/google-login", async (req, res) => {
  try {
    const { credential, userInfo } = req.body;
    let email, firstName, lastName, picture;

    if (credential) {
      const payloadBase64 = credential.split(".")[1];
      const decodedPayload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      email = decodedPayload.email;
      firstName = decodedPayload.given_name || decodedPayload.name || "User";
      lastName = decodedPayload.family_name || "";
      picture = decodedPayload.picture;
    } else if (userInfo) {
      email = userInfo.email;
      firstName = userInfo.firstName || userInfo.givenName || "User";
      lastName = userInfo.lastName || userInfo.familyName || "";
      picture = userInfo.picture;
    }

    if (!email) {
      return res.status(400).json({ message: "Invalid Google credentials" });
    }

    const targetEmail = email.toLowerCase();
    let user = await User.findOne({
      $or: [{ emailId: targetEmail }, { email: targetEmail }],
    });

    if (!user) {
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex") + "A@1z!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        firstName,
        lastName,
        emailId: targetEmail,
        email: targetEmail,
        password: hashedPassword,
        profilePicture: picture || undefined,
        photos: picture ? [picture] : [],
        location: "Earth",
      });

      await user.save();
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google authentication successful",
      token,
      user: formatAuthUserResponse(user),
    });
  } catch (error) {
    console.error("Error in Google authentication:", error);
    return res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful!");
});

module.exports = authRouter;