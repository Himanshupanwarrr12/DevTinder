const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const port = 7777;
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

// Serve static files first
app.use(express.static('frontend-build-path'));

// Then handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend-build-path', 'index.html'));
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
