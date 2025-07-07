const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const userConnectionReq = require("../models/userConnection");
const user = require("../models/user");

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
    const toUser = await user.findById(toUserId)
    if(!toUser){
      return res.status(400).send("user not found!!")
    }
    
    const ConnectionRequest = new userConnectionReq({
      fromUserId,
      toUserId,
      status,
    });

    // validaton for not send request yoursel.
    if(ConnectionRequest.fromUserId === ConnectionRequest.fromUserId){
      return res.status(200).send("You can't send connection to yourself.")
    }

    //if req(pending) person1 can't send req again to same person & person2 also can't send req to person 1
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
