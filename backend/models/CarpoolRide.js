const mongoose = require("mongoose");

const CarpoolRideSchema = new mongoose.Schema(
  {
    cancelledAt: { type: Date },
    completedAt: { type: Date, required: false },
    car: { type: String, required: true },
    carNumber: { type: String, required: true },
    driverID: { type: String , required: true},
    driverGender: { type: String, required: true },
    driverName: { type: String, required: true },
    driverNumber: { type: String, required: true },
    passengerAccepted: { type: Boolean, required: true },
    passengerCurrentLocationLatitude: { type: Number, required: true },
    passengerCurrentLocationLongitude: { type: Number, required: true },
    requestAccepted: { type: Boolean, required: true },
    requestCapacity: { type: Number, required: true },
    requestDestination: { type: String, required: true },
    requestFare: { type: String, required: true },
    requestOrigin: { type: String, required: true },
    requestType: { type: String, required: true },
    requestVehicle: { type: String, required: true },
    status: { type: String, required: true },
    additionalPassengers: { type: Number, required: true },
    dropoff: { type: String, required: true },
    fare: { type: String, required: true },
    mode: { type: String, required: true },
    passengerId: { type: [String], required: true },
    passengerName: { type: [String], required: true },
    passengerPhone: { type: [String], required: true },
    pickup: { type: String, required: true },
    rideStatus: { type: String, required: true },
    rideType: { type: String, required: true },
    selectedCarpoolers: { type: String, required: true },
    selectedDriver: { type: String, required: true },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Carpool-Ride", CarpoolRideSchema);

module.exports = Ride;
