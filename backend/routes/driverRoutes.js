const express = require('express');
const Driver = require('../models/Driver');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Driver API is working!' });
});

module.exports = router;