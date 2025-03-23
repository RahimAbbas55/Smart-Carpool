const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaint: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Driver" },
  compositeId: { type: String, required: true, unique: true }
});

const Complaint = mongoose.model("Driver-Complaint", complaintSchema);

module.exports = Complaint;