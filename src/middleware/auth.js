const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  console.log("body", req.body)
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new Error("Please login first");
    }
    const decodedData = jwt.verify(token, "secret");
    const { _id } = decodedData;
    // console.log(decodedData)

    const user = await User.findById(_id);
    // console.log(user)
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
