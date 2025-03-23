require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get('/:userId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('smartCarpool_DB');

        let userId = req.params.userId;
        let query = {
            $or: [{ passengerId: userId }, { passengerId: new ObjectId(userId) }, { passengerId: { $in: [userId] } }]
        };

        const singleRides = await db.collection('single-rides').find(query).toArray();
        const carpoolRides = await db.collection('carpool-rides').find(query).toArray();

        console.log('Single Rides:', singleRides.length, 'Carpool Rides:', carpoolRides.length);

        const rideHistory = [...singleRides, ...carpoolRides].map(ride => ({
            _id: ride._id,
            driverName: ride.driverName || 'Unknown Driver',
            driverNumber: ride.driverNumber || 'N/A',
            car: ride.car || 'N/A',
            carNumber: ride.carNumber || 'N/A',
            rideType: ride.requestType || 'Unknown',
            status: ride.status || 'Unknown',
            fare: ride.requestFare ? `${ride.requestFare} PKR` : 'N/A',
            origin: ride.requestOrigin || 'Unknown',
            destination: ride.requestDestination || 'Unknown',
        }));

        res.json({ success: true, data: rideHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    } finally {
        await client.close();
    }
});

router.get('/driver/:driverId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('smartCarpool_DB');

        let driverId = req.params.driverId;
        let query = {
            $or: [{ driverID: driverId }, { driverID: new ObjectId(driverId) }]
        };

        const singleRides = await db.collection('single-rides').find(query).toArray();
        const carpoolRides = await db.collection('carpool-rides').find(query).toArray();

        const rideHistory = [...singleRides, ...carpoolRides].map(ride => ({
            _id: ride._id,
            driverName: ride.driverName || 'Unknown Driver',
            driverNumber: ride.driverNumber || 'N/A',
            car: ride.car || 'N/A',
            carNumber: ride.carNumber || 'N/A',
            rideType: ride.requestType || 'Unknown',
            status: ride.status || 'Unknown',
            fare: ride.requestFare ? `${ride.requestFare} PKR` : 'N/A',
            origin: ride.requestOrigin || 'Unknown',
            destination: ride.requestDestination || 'Unknown',
            passengerNames: ride.passengerName || [], // Ensure it's an array
            passengerIds: ride.passengerId || [], // Ensure it's an array
        }));

        res.json({ success: true, data: rideHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    } finally {
        await client.close();
    }
});

module.exports = router;
