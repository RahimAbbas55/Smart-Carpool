const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: { type: String },
  resetCode: { type: Number },
  tokenExpiry: { type: Date },
  wallet: {
    type: Number,
    default: 0, 
  },
  gender: {
    type: String,
    enum: ['male', 'female'], 
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  rating: {  
    type: Number,
    default: 5,  
    min: 1,      
    max: 5,       
  }
}, { timestamps: true });

const Passenger = mongoose.model('Passenger', passengerSchema, 'passengers');

module.exports = Passenger;