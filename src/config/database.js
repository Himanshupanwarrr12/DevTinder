const mongoose = require("mongoose");

const dbConnection = async () => {
  mongoose.connect(
    "Dbkey"
  );
};

module.exports = dbConnection;


