const mongoose = require('mongoose');

const passengerRatingSchema = new mongoose.Schema({
  passengerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Passenger', 
    required: true 
  },
  rideId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  driverName: { 
    type: String, 
    required: true 
  },
  driverProfilePicture: { 
    type: String,  
    default: null  
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  review: { 
    type: String, 
    maxlength: 1000 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const PassengerRating = mongoose.model('PassengerRating', passengerRatingSchema);
module.exports = PassengerRating;