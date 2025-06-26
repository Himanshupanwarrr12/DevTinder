const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: "string",
  },
  lastName: {
    type: "string",
  },
  emailId: {
    type: "string",
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
