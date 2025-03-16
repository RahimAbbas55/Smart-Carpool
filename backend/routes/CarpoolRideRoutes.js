const express = require('express');
const CarpoolRide = require('../models/CarpoolRide');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Carpool Ride API is working!' });
});

module.exports = router;