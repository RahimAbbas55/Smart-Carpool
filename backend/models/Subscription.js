const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true
  },
  compositeId: {
    type: String,
    required: true,
    unique: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger', 
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);