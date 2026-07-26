const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth").userAuth;
const ConnectionRequest = require("../models/connectionRequest");
const { getSecretRoomId } = require("../utils/socket");

const USER_SAFE_DATA = [
  "_id",
  "firstName",
  "lastName",
  "email",
  "emailId",
  "profilePicture",
  "photos",
  "gender",
  "dateOfBirth",
  "bio",
  "height",
  "education",
  "occupation",
  "company",
  "drinking",
  "smoking",
  "workout",
  "pets",
  "religion",
  "languages",
  "interests",
  "relationshipGoal",
  "preferences",
  "currentRole",
  "location",
];
const USER_FEED_DATA = [
  "_id",
  "firstName",
  "lastName",
  "email",
  "emailId",
  "dateOfBirth",
  "bio",
  "gender",
  "photos",
  "profilePicture",
  "education",
  "occupation",
  "company",
  "drinking",
  "smoking",
  "workout",
  "pets",
  "religion",
  "languages",
  "interests",
  "relationshipGoal",
  "preferences",
  "highestQualification",
  "collegeInstitution",
  "currentRole",
  "totalExperience",
  "skills",
  "location",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "profilePicture"]);

    res.json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate({
        path: "fromUserId",
        select: USER_SAFE_DATA.join(" "),
      })
      .populate({
        path: "toUserId",
        select: USER_SAFE_DATA.join(" "),
      });

    // Extract the "other user" from each connection
    const data = connections.map((conn) => {
      const from = conn.fromUserId;
      const to = conn.toUserId;

      // Return the other person, not the logged-in user
      return from._id.equals(loggedInUser._id) ? to : from;
    });

    res.json({
      message: "Connections fetched successfully",
      data,
      connections
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).send("ERROR: " + error.message);
  }
});



userRouter.get("/user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(USER_SAFE_DATA);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // All connection requests involving the logged in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId status");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      // Hide users with any connection request status
      if (request.fromUserId.equals(loggedInUser._id)) {
        hideUsersFromFeed.add(request.toUserId.toString());
      } else {
        hideUsersFromFeed.add(request.fromUserId.toString());
      }
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_FEED_DATA)
      .skip(skip)
      .limit(limit);

    // Shuffle feed using Fisher-Yates algorithm so each user sees a different order
    for (let i = feedUsers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [feedUsers[i], feedUsers[j]] = [feedUsers[j], feedUsers[i]];
    }

    res.json({
      message: "Feed users fetched successfully",
      data: feedUsers,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// GET /chat/room/:targetUserId - get secure room ID for chat
userRouter.get("/chat/room/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { targetUserId } = req.params;
    const roomId = getSecretRoomId(userId, targetUserId);
    res.json({ roomId });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
