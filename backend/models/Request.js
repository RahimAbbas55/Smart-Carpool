const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: true,
    },
    passengerCurrentLocationLatitude: {
        type: Number,
        required: true,
    },
    passengerCurrentLocationLongitude: {
        type: Number,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
        enum: ["carpool", "single"],
    },
    requestVehicle: {
        type: String,
        required: true,
    },
    requestAccepted: {
        type: Boolean,
        required: true,
    },
    requestCapacity: {
        type: Number,
        required: function () {
            return this.requestType === "carpool";
        },
        validate: {
            validator: function (value) {
                return this.requestType !== "carpool" || (value > 0 && value <= 4 && Number.isInteger(value));
            },
            message: "Capacity must be a positive integer for carpool requests.",
        },
    },
    requestOrigin: {
        type: String,
        required: true,
    },
    requestDestination: {
        type: String,
        required: true,
    },
    requestFare: {
        type: Number,
        required: true,
    },
    driverGender: {
        type: String,
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver', 
        required: false, 
    },
});

const Request = mongoose.model('Request', requestSchema, 'requests');
module.exports = Request;