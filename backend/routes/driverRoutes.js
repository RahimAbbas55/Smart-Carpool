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

// update driver details
router.put('/updateDriver', async (req, res) => {
    try {
        const { id, updates } = req.body; // Expecting `id` from the frontend

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const updatedDriver = await Driver.findByIdAndUpdate(
            {_id: id},
            { $set: updates },             
            { new: true, runValidators: true }
        );

        if (!updatedDriver) {
            return res.status(404).json({ error: "Driver not found" });
        }

        return res.status(200).json({
            message: "Driver updated successfully",
            driver: updatedDriver
        });

    } catch (error) {
        console.error("Error updating driver:", error);
        return res.status(500).json({ error: "Failed to update driver", details: error.message });
    }
});
router.post('/updateWallet', async (req, res) => {
    let { driverId, amount } = req.body;
    amount = Number(amount);
  
    console.log("Request Body:", req.body);
    console.log("Amount:", amount);
  
    if (!driverId || typeof driverId !== 'string' || driverId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(driverId)) {
      return res.status(400).json({ message: "Invalid driverId format" });
    }
  
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }
  
    try {
      const db = mongoose.connection.db;
      const driversCollection = db.collection('drivers'); 
  
      const objectId = new mongoose.Types.ObjectId(driverId);
  
      const driver = await driversCollection.findOne({ _id: objectId });
  
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      const newWalletBalance = (driver.wallet || 0) + amount;
  
      await driversCollection.updateOne(
        { _id: objectId },
        { $set: { wallet: newWalletBalance } }
      );
  
      res.json({ success: true, wallet: newWalletBalance });
    } catch (error) {
      console.error("Error updating wallet:", error);
      res.status(500).json({ message: 'An error occurred while updating the wallet' });
    }
  });
module.exports = router;