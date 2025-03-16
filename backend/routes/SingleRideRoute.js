const express = require('express');
const SingleRide = require('../models/SingleRide');
const router = express.Router();
const mongoose = require('mongoose')

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Single Ride API is working!' });
});

router.post('/addDetailToDB', async (req, res) => {
    console.log(req.body);
    try {
        const rideID = new mongoose.Types.ObjectId(); 
        const newRide = new SingleRide({ driverID: req.body.driverId, rideID, ...req.body });
        await newRide.save();
        // you can send ride data to add ratings
        res.status(201).json({ success: 'Done' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/getRideId' )


module.exports = router;