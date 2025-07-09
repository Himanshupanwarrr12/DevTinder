const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middleware/auth");
const UserConnection = require("../models/userConnection");
const User = require("../models/user");

//api for showing all request
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //finding all requests to loggedin User
    const userConnection = await UserConnection.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "gender", "skills"]);
    if (!userConnection) {
      return res.status(400).send("Requests are empty!!");
    }

    return res.status(200).send(userConnection);
  } catch (error) {
    return res.status(400).send("error found:" + error.message);
  }
});

userRouter.get("/user/request/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionReq = await UserConnection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "skills"])
      .populate("toUserId", ["firstName", "skills"]);

    if (!connectionReq) {
      return res.status(400).send("No connection found");
    }

    const connectionReqData = connectionReq.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ connectionReqData });
  } catch (error) {
    return res.status(400).send("Error : " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page-1)*limit

    //first i will find the user which i don't want in the feed, and that's are requested connection
    const allReqConnections = await UserConnection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId ");

    // now i will seprate the all users from the req connnections
    const hideUserIdFromFeed = new Set();
    allReqConnections.forEach((req) => {
      hideUserIdFromFeed.add(req.fromUserId.toString()),
        hideUserIdFromFeed.add(req.toUserId.toString());
    });

    // now i will get all the user from the db expect the above id
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserIdFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName skills").skip(skip).limit(limit)

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Error found : " + error.message);
  }
});

module.exports = userRouter;
