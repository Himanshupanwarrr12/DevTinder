const express = require("express");
const app = express()
const User = require("./models/user");
const dbConnection = require("./config/database");
const port = 7777;



// creating api for storing user in database
app.post( '/signUp', async (req,res) => {

    //creating new instance of User for userObj
    const  userObj = new User({
        firstName : "Himanshu",
        lastName : "Panwar",
        age : 21
    })

    try {
         await userObj.save()
    res.send(" user succesfully stored")
    } catch (error) {
        res.status(400).
        res.send("error found")
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
