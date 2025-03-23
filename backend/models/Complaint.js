const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaint: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Passenger" },
  compositeId: { type: String, required: true, unique: true }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;