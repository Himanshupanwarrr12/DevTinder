const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const userConnectionReq = require("../models/userConnection")

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.id;
    const status = req.params.status;

    
    const allowedReqStatus = ["interested", "ignored"];
    if (!allowedReqStatus.includes(status)) {
      return res.status(200).send("invalid request Status!!");

    }
    const ConnectionRequest = new userConnectionReq({
      fromUserId,
      toUserId,
      status,
    });

    const existingConnectionReq = await userConnectionReq.findOne({
      $or :[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    })
    if(existingConnectionReq){
      return res.status(400).send("Connection request already exist")
    }
    

    const Data = await ConnectionRequest.save();

    res.status(200).send(Data);
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

module.exports = requestRouter;
