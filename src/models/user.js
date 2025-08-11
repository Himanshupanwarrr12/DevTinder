const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 12,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 12,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: function isValidEmail(email) {
        return validator.isEmail(email);
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: function isStrongPassword(value) {
        return validator.isStrongPassword(value);
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 100,
      validator: Number.isInteger,
    },
    skills: {
      type: [String],
      required:false,
    },
    about: {
      type: String,
      default: "default description hai",
      required:false
    },
    photoUrl: {
      type: String,
      default:"https://i0.wp.com/fdlc.org/wp-content/uploads/2021/01/157-1578186_user-profile-default-image-png-clipart.png.jpeg?fit=880%2C769&ssl=1",
      required:false
    },
  },
  { timestamps: true }
);


userSchema.methods.getJwt = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "secret",{expiresIn:"7d"});
 
  return token
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
  const user = this
  const isValidPassword = await bcrypt.compare(passwordInputByUser,user.password)
  return isValidPassword
}

module.exports = mongoose.model("User", userSchema);

