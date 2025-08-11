const express = require('express')
const authRouter = express.Router()
const {validateSignUpData} = require('../utils/validateSignUpData')
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signUp", async (req, res) => {
  try {
    //validating  data
    validateSignUpData(req);

    //encrypting data
    const { firstName, skills, emailId, gender,about,photoUrl, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    // new instance of User for userObj
    const userObj = new User({
      firstName,
      emailId,
      gender,
      skills:[],
      password: hashedPass,
    });
   const savedUser = await userObj.save();
   const token = await savedUser.getJwt();

      res.cookie("token", token);
    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message || "SignUp failed "});
  }
});


authRouter.post("/login", async (req, res) => {

  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
       return res.status(401).json({ error: "Invalid Credentials!!" }); 
    }
    const passwordCheck = await user.validatePassword(password)
     if (!passwordCheck) {
      return res.status(401).json({ error: "Invalid Credentials!!" }); // Use return + status
    }
      const token = await user.getJwt();
      res.cookie("token", token);
      res.send(user);
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

authRouter.post("/logout",async (req,res)=>{
  res.cookie("token","",{
    expires: new Date(0),path : '/'})
    res.send("loged out successfully")
})

module.exports = authRouter;