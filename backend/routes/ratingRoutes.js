const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PassengerRating = require('../models/Rating');

router.post('', async (req, res) => {
  try {
      const { passengerId, rideId, driverId, driverName, rating, review } = req.body;

      if (rating === undefined) {
          return res.status(400).json({ message: "Rating is required." });
      }

      const newReview = new PassengerRating({
          passengerId,
          rideId,
          driverId,
          driverName,
          rating,
          review
      });

      await newReview.save();

      const db = mongoose.connection.db;
      const driversCollection = db.collection('drivers');
      const objectId = new mongoose.Types.ObjectId(driverId);

      const driver = await driversCollection.findOne({ _id: objectId });

      if (!driver) {
          return res.status(404).json({ message: "Driver not found." });
      }

      const defaultRating = 5;
      let totalRatings = 1; 
      let sumRatings = defaultRating; 

      const allRatings = await PassengerRating.find({ driverId });

      if (allRatings.length > 0) {
          totalRatings += allRatings.length; 
          sumRatings += allRatings.reduce((sum, r) => sum + r.rating, 0);
      }
      const newAvgRating = sumRatings / totalRatings;

      await driversCollection.updateOne(
          { _id: objectId },
          { 
              $set: { rating: Number(newAvgRating.toFixed(2)) }
          }
      );

      res.status(201).json({
          message: "Review submitted and driver rating updated!",
          newAvgRating: Number(newAvgRating.toFixed(2))
      });

  } catch (error) {
      console.error("Error saving review:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:passengerId', async (req, res) => {
    try {
        const { passengerId } = req.params;

        const ratings = await PassengerRating.find({ passengerId });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: "No ratings found for this passenger" });
        }

        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error fetching passenger ratings:", error);
        res.status(500).json({ message: "Failed to fetch ratings" });
    }
});

module.exports = router;