const express = require("express");
const Request = require("../models/Request");
const router = express.Router();
const io = require('../server')// Import the Socket.IO instance from server.js

router.get("/", (req, res) => {
  res.status(200).json({ message: "Request API is working!" });
});

router.post("/addSingleRequest", async (req, res) => {
  const {
    passengerName,
    passengerCurrentLocationLatitude,
    passengerCurrentLocationLongitude,
    requestType,
    requestVehicle,
    requestAccepted,
    requestOrigin,
    requestDestination,
    requestFare,
    requestCapacity,
    driverGender,
  } = req.body;

  try {
    const newRequest = new Request({
      passengerName,
      passengerCurrentLocationLatitude,
      passengerCurrentLocationLongitude,
      requestType,
      requestVehicle,
      requestAccepted,
      requestOrigin,
      requestDestination,
      requestFare,
      requestCapacity,
      driverGender,
    });
    const savedRequest = await newRequest.save();
    io.emit('newRequest', savedRequest);

    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: "Error saving the request", error: error.message });
  }
});

router.get("/getRequests", async (req, res) => {
  try {
    const requests = await Request.find({ requestAccepted: false }); 
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
});


module.exports = router;