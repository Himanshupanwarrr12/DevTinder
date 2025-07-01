const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength:2,
    maxLength:12
  },
  lastName: {
    type: String,
    trim:true,
       minLength:2,
    maxLength:12
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
   validate: function isValidEmail (email){
      return  validator.isEmail(email)
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate : function isStrongPassword(value){
      return validator.isStrongPassword(value)
    }

  },
  gender: {
    type: String,
    required:true,
    enum:['male','female','other'],
    lowercase:true,
    trim:true,
    },
  age: {
    type: Number,
    min:0,
    max:100,
    validator: Number.isInteger()
  },
  skills:{
    type: [String],
  validate: {
  validator: function(value) {
    return value.length >= 2 && value.length <= 6;
  },
  message: "Skills must be between 2 and 6"
}
  },
  about: {
    type: String,
    default:"default description hai"
  },
  photoUrl:{
    type: String,
  },
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
