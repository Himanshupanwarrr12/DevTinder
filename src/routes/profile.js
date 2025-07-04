const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validateSignUpData");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      return res.status(400).send("Invalid edit request");
    }
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(loggedInUser);
    await loggedInUser.save();
    res.status(200).send("Edited Successfully");
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

profileRouter.patch("/profile/forgetPassword",userAuth, (req,res)=>{
  
  
})

module.exports = profileRouter;
