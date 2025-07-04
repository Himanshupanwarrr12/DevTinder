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
      enum: { 
      values: ["male", "female", "other"],
      message:"Gender is not defined"},
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 100,
      validator: Number.isInteger(),
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          // Ensure value exists and is an array
          if (!Array.isArray(value)) return false;
          if (value.length < 2 || value.length > 6) return false;
          return value.every(
            (skill) => typeof skill === "string" && skill.trim() !== ""
          );
        },
      },
    },
    about: {
      type: String,
      default: "default description hai",
    },
    photoUrl: {
      type: String,
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

