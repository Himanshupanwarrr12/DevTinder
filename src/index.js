const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const port = 7777;
app.use(express.json());
app.use(cookieParser());


const  authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter) 


dbConnection()
  .then(() => {
    console.log("database established");

    app.listen(port, () => {
      console.log(`"sever is listening at ${port} "`);
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });
