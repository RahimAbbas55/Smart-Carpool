const mongoose = require("mongoose");

const CarpoolRideSchema = new mongoose.Schema(
  {
    cancelledAt: { type: Date },
    completedAt: { type: Date, required: false },
    additionalPassengers: { type: Number, required: true },
    dropoff: { type: String, required: true },
    fare: { type: [String], required: true },
    mode: { type: String, required: true },
    passengerCurrentLocationLatitude: { type: Number, required: true },
    passengerCurrentLocationLongitude: { type: Number, required: true },
    passengerId: { type: [String], required: true },
    passengerName: { type: [String], required: true },
    passengerPhone: { type: [String], required: true },
    pickup: { type: String, required: true },
    rideStatus: { type: String, required: true },
    rideType: { type: String, required: true },
    selectedCarpoolers: { type: String, required: true },
    selectedDriver: { type: String, required: true },
    driverId: { type: String, required: true },
    driverPhone: { type: String, required: true },
    driverFirstName: { type: String, required: true },
    driverLastName: { type: String, required: true },
    licensePlate: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicleType: { type: String, required: true },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Carpool-Ride", CarpoolRideSchema);

module.exports = Ride;
