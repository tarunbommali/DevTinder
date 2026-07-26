const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ValidateEditProfileData } = require("../utils/validation");

const formatUserData = (user) => ({
  _id: user._id,
  email: user.email || user.emailId,
  emailId: user.emailId || user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  bio: user.bio,
  photos: user.photos?.length ? user.photos : (user.profilePicture ? [user.profilePicture] : []),
  profilePicture: user.profilePicture || user.photos?.[0] || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
  location: user.location,
  height: user.height,
  education: user.education || user.highestQualification,
  occupation: user.occupation || user.currentRole,
  company: user.company,
  drinking: user.drinking,
  smoking: user.smoking,
  workout: user.workout,
  pets: user.pets,
  religion: user.religion,
  languages: user.languages || [],
  interests: user.interests?.length ? user.interests : (user.skills || []),
  skills: user.skills?.length ? user.skills : (user.interests || []),
  relationshipGoal: user.relationshipGoal,
  preferences: user.preferences,
  verified: user.verified,
  profileCompleted: user.profileCompleted,
  isPremium: user.isPremium,
  highestQualification: user.highestQualification || user.education,
  collegeInstitution: user.collegeInstitution,
  currentRole: user.currentRole || user.occupation,
  totalExperience: user.totalExperience,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User profile fetched successfully",
      user: formatUserData(user),
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error.message);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

const editProfileHandler = async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      return res.status(400).json({ message: "Invalid Edit Request: Unallowed fields included." });
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    if (req.body.email) {
      user.emailId = req.body.email;
      user.email = req.body.email;
    }

    await user.save();

    res.status(200).json({
      message: `${user.firstName}, Profile updated successfully`,
      user: formatUserData(user),
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(400).json({ message: "Failed to update profile", error: error.message });
  }
};

profileRouter.patch("/profile/edit", userAuth, editProfileHandler);
profileRouter.put("/profile/edit", userAuth, editProfileHandler);
profileRouter.post("/profile/edit", userAuth, editProfileHandler);

module.exports = profileRouter;
