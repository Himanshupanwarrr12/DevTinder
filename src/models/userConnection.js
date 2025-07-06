const mongoose = require("mongoose");

const userConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["ignored", "accepted", "interested", "rejected"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConnectionRequest", userConnectionRequestSchema);
