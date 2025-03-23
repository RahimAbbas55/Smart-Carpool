const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "passenger",
    required: true,
  },
  jazzCashNumber: {
    type: String,
    required: true,
    match: /^\+92[0-9]{10}$/, 
  },
  mpin: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", AccountSchema);