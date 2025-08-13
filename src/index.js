const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const port = 7777;
const cors = require("cors")

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:["*"], 
    credentials: true
  })
);

// API Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

dbConnection()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });