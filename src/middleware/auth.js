const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const  token  = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
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
    req.user = user
    next();
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
};

module.exports = userAuth;