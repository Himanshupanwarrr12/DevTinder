const mongoose = require("mongoose");

const dbConnection = async () => {
  mongoose.connect(
    "mongodb+srv://himanshudoes:Himanshu12@cluster0.cjcbcbp.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = dbConnection;


