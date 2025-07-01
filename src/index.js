const express = require("express");
const app = express();
const User = require("./models/user");
const dbConnection = require("./config/database");
const {validateSignUpData} = require('./utils/validateSignUpData')
const bcrypt = require('bcrypt')
const port = 7777;
app.use(express.json());

//  api for storing user in database
app.post("/signUp", async (req, res) => {
try { 
  //validating  data
  validateSignUpData(req)

  //encrypting data 
  const {firstName,skills,emailId,gender,password} = req.body
  const hashedPass = await bcrypt.hash(password ,10)

  // instance of User for userObj
  const userObj = new User({
    firstName,
    emailId,
    gender,
    skills,
    password: hashedPass
  });
  
    await userObj.save();
    res.send(" user succesfully stored");
  } catch (error) {
    res.status(400).send("error found:" + error);
  }
});

// api for user login
app.post("/login",async (req,res)=>{
try{ 
  const {emailId,password} = req.body

  const user = await User.findOne({emailId:emailId})
  console.log(user.password)
  if(!user){
    throw new Error("User not found")
  }

  isValidPassword = await bcrypt.compare(password, user.password)
  if(!isValidPassword){
    throw new Error("invalid credentianls")
  }else{
    res.send(" user login succesfully ");
  }
} catch (error) {
    res.status(400).send("error found:" + error);
  }
})

//  api for finding a user from a database
app.get("/user", async (req, res) => {
  const userLastName = req.body.lastName;

  try {
    const users = await User.find({ lastName: userLastName });

    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

//  a api to getting all users/feed
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(404).send("something went wrong");
    console.log(error);
  }
});

// api for  deleting a user
app.delete("/user", async (req, res) => {
  try {
    // await User.deleteOne({age:'22'})
    const deletedUser = await User.findOneAndDelete({ age: "22" });
    console.log(deletedUser);
    res.status(200).send("deleted successfully");
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

// api for updating user
app.patch("/user", async (req, res) => {
  //this is the id of the user
  const userId = req.body._id;
  const data = req.body;

  try {
    //now creating a barrier so we can update only selected things not all
    const allowedUpdates = ["firstName",  "lastName", "_id", "photoUrl", "gender", "age", "about"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    console.log(isUpdateAllowed)
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed")
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true
    });
    res.status(200).send("user updated");
  } catch (error) {
    res.status(400).send("Update failed"+ error.message);
  }
});

dbConnection()
  .then(() => {
    console.log("database established");

    app.listen(port, () => {
      console.log(`"app is listening at ${port} "`);
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });
