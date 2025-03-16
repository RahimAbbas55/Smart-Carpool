const express = require('express');
const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Passenger = require('../models/Passenger');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Driver API is working!' });
});

router.post('/addDriver', async (req, res) => {
    try {
        const {
            driverPassword,
            driverEmail,
            driverPhone,
            driverPhoto,
            driverFirstName,
            driverLastName,
            driverDOB,
            driverCnicFront,
            driverCnicBack,
            driverCnicNumber,
            driverSelfie,
            vehicleRegisterationFront,
            vehicleRegisterationBack,
            vehicleProductionYear,

            vehicleType,
            carType,
            brand,
            vehicleName,
            vehicleColor,
            licenseNumber,
            vehiclePhotos,
            passengerId
        } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(passengerId)) {
            return res.status(400).json({ error: "Invalid Passenger ID format" });
        }
        const passengerObjectId = new mongoose.Types.ObjectId(passengerId);
        const existingPassenger = await Passenger.findById(passengerObjectId);
        if (!existingPassenger) {
            return res.status(404).json({ error: "Passenger not found" });
        }
        const newDriver = new Driver({
            driverPassword,
            driverEmail,
            driverPhone,
            driverPhoto,
            driverFirstName,
            driverLastName,
            driverDOB,
            driverCnicFront,
            driverCnicBack,
            driverCnicNumber,
            driverSelfie,
            vehicleRegisterationFront,
            vehicleRegisterationBack,
            vehicleProductionYear,
            vehicleType,
            carType,
            brand,
            vehicleName,
            vehicleColor,
            licenseNumber,
            vehiclePhotos,
            passengerId: passengerObjectId
        });
        const data = await newDriver.save();
        res.status(201).json({ message: "Driver added successfully", driver: newDriver });

    } catch (error) {
        console.error("Error saving driver:", error);
        res.status(500).json({ error: "Failed to add driver", details: error.message });
    }
});

// Fetch Driver's data based on the passenger id
router.get('/getDriverDetails', async (req, res) => {
    const { passengerId } = req.query;
    try {
        // Validate input
        if (!passengerId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passenger ID is required' 
            });
        }
        const driver = await Driver.findOne({ passengerId: passengerId });
        
        if (!driver) {
            return res.status(404).json({ 
                success: false, 
                message: 'No driver found for this passenger' 
            });
        }
        
        // Return driver details
        const driverDetails = {
            id: driver._id,
            firstName: driver.driverFirstName,
            lastName: driver.driverLastName,
            driverPhone: driver.driverPhone,
            driverPhoto: driver.driverSelfie,
            vehicle: driver.vehicleName,
            brand: driver.brand,
            licensePlate: driver.licenseNumber,
            carType: driver.carType,
            rating: driver.rating,
            driverEmail: driver.driverEmail,
            dateOfBirth: driver.driverDOB,
            vehicleType: driver.vehicleType,
        };
        
        return res.status(200).json({
            data: driverDetails
        });
        
    } catch (error) {
        console.error('Error retrieving driver details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving driver details',
            error: error.message
        });
    }
});
module.exports = router;