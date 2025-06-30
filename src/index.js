const express = require("express");
const app = express();
const User = require("./models/user");
const dbConnection = require("./config/database");
const port = 7777;
app.use(express.json());

// creating api for storing user in database
app.post("/signUp", async (req, res) => {
  //creating new instance of User for userObj
  const userObj = new User(req.body);
  try {
    await userObj.save();
    res.send(" user succesfully stored");
  } catch (error) {
    res.status(400).send("error found:"+ error);
  }
});

// creating api for finding a user from a database
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

// creating a api to getting all users/feed

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(404).send("something went wrong");
    console.log(error);
  }
});


//creating api for  deleting a user
app.delete('/user', async (req,res) => {
  try {

  // await User.deleteOne({age:'22'})
  const deletedUser = await User.findOneAndDelete({ age: "22" })
  console.log(deletedUser)
    res.status(200).send("deleted successfully")
  } catch (error) {
    res.status(404).send("something went wrong")
  }
  
})

//creating api for updating user 
app.patch('/user', async (req,res) => {
  //this is the id of the user
  const userId = req.body._id
  //this is the data which user wants to update
  const data = req.body
  try {
    const updatedUser = await User.findByIdAndUpdate({_id:userId},data,{returnDocument : "after"})
    console.log(updatedUser)
  
    res.status(200).send("user updated")
  } catch (error) {
    res.status(500).send("something went wrong")
  }
})

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
