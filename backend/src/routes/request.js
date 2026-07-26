const express = require("express");

const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Checking User Exist
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      //  If there is an existting ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exits!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found!" });
      }

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();
      res.json({
        message: loggedUser.firstName + " has " + status + " the request.",
        data: updatedRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR:  " + error.message);
    }
  }
);

// Remove Connection / Unmatch
requestRouter.delete(
  "/connection/:targetUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const targetUserId = req.params.targetUserId;

      await ConnectionRequest.deleteMany({
        $or: [
          { fromUserId, toUserId: targetUserId },
          { fromUserId: targetUserId, toUserId: fromUserId },
        ],
      });

      res.json({ message: "Connection removed successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Block User
requestRouter.post(
  "/user/block/:targetUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const targetUserId = req.params.targetUserId;

      await ConnectionRequest.deleteMany({
        $or: [
          { fromUserId, toUserId: targetUserId },
          { fromUserId: targetUserId, toUserId: fromUserId },
        ],
      });

      const blockRequest = new ConnectionRequest({
        fromUserId,
        toUserId: targetUserId,
        status: "ignored",
      });
      await blockRequest.save();

      res.json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
