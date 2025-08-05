const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validateSignUpData");
const bcrypt = require("bcrypt");

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
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).send("Edited Successfully");
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    // 1. Checking if old password is correct
    const passwordCheck = await user.validatePassword(oldPassword);
    if (!passwordCheck) {
      return res.status(401).send("Old password is incorrect");
    }
    // 2. Hashing new password
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;

    // 3. Saving updated password
    await user.save();

    res.status(200).send("Password updated successfully");
  } catch (error) {
    res.status(400).send("Error found: " + error.message);
  }
});

module.exports = profileRouter;
