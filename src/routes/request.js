const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const userConnectionReq = require("../models/userConnection");
const user = require("../models/user");

//api for sending request
requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.id;
    const status = req.params.status;

    const allowedReqStatus = ["interested", "ignored"];
    if (!allowedReqStatus.includes(status)) {
      return res.status(200).send("invalid request Status!!");
    }

    //validation for toUser is exist in ourDb then send connection
    const toUser = await user.findById(toUserId);
    if (!toUser) {
      return res.status(400).send("user not found!!");
    }

    const ConnectionRequest = new userConnectionReq({
      fromUserId,
      toUserId,
      status,
    });

    // validaton for not send request yoursel.
    if (fromUserId === toUserId) {
      return res.status(400).send("You can't send connection to yourself.");
    }

    //if req(pending) person1 can't send req again to same person & person2 also can't send req to person 1
    const existingConnectionReq = await userConnectionReq.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionReq) {
      return res.status(400).send("Connection request already exist");
    }

    const Data = await ConnectionRequest.save();

    res.status(200).send(Data);
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});
//api  for viewing request
requestRouter.post(
  "/request/review/:status/:id",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status,id:requestedConnectionId } = req.params;
      // console.log(req.params)
      // console.log("loggedInuser :", loggedInUser)
      // console.log("requestedConnectionId :", requestedConnectionId)
      

      // Checking valid status
      const allowedReqStatus = ["accepted", "rejected"];
      if (!allowedReqStatus.includes(status)) {
        return res.status(400).send("Invalid request!!");
      }

      //  checking connectinoReq
      const connectionReq = await userConnectionReq.findOne({
        _id: requestedConnectionId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionReq) {
         // Add debug logging
        console.log("Request not found with params:", {
          requestedConnectionId,
          toUserId: loggedInUser._id,
          status: "interested"
        });
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      // Updating the status
      connectionReq.status = status;
      
      const updatedRequest = await connectionReq.save();
      res.status(200).send(updatedRequest);
    } catch (error) {
      console.error("Request error:", error);
      return res.status(500).send("Server error: " + error.message);
    }
  }
);
module.exports = requestRouter;
