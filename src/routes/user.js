const express = require('express')
const userRouter = express.Router()
const userAuth = require('../middleware/auth')
const UserConnection = require('../models/userConnection')

//api for showing all request
userRouter.get('/user/request/received',userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user
        
        //finding all requests to loggedin User
        const userConnection = await UserConnection.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","gender","skills"])
        if(!userConnection){
            return res.status(400).send("Requests are empty!!")
        }

        return res.status(200).send(userConnection)
    } catch (error) {
        return res.status(400).send("error found:"+error.message)
    }
})


userRouter.get('/user/request/connections', userAuth, async (req,res) => {

   try {
     const loggedInUser = req.user

    const connectionReq = await UserConnection.find({
        $or:[ 
           { toUserId: loggedInUser._id,status:"accepted"},
           { fromUserId: loggedInUser._id,status:"accepted" },
        ]
    })
    .populate("fromUserId",["firstName","skills"])
    .populate("toUserId",["firstName","skills"])

    if(!connectionReq){
        return res.status(400).send("No connection found")
    }
    
    const connectionReqData = connectionReq.map((row)=> {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId
        }
      return  row.fromUserId})
    res.json({connectionReqData})
    
   } catch (error) {
    return res.status(400).send("Error : " + error.message)
   }
})

module.exports = userRouter