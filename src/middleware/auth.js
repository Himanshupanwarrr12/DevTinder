const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new Error("Please login first");
    }
    const decodedData = jwt.verify(token, "secret");
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }

    // attaching user to req
    req.user = user;
    next();
  } catch (error) {
    res.send("error found:" + error);
  }
};

module.exports = userAuth;
