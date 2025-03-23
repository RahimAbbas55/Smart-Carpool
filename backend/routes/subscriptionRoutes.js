const express = require('express');
const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Backend request received", req.body);
    const { userId, packageName, validFrom, validTo, paymentStatus } = req.body;

    if (!userId || !packageName || !validFrom || !validTo || !paymentStatus) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const compositeId = `${userId}_${packageName}`;

    const existingSubscription = await Subscription.findOne({ compositeId });
    if (existingSubscription) {
      return res.status(400).json({ error: 'Subscription already exists for this package and user' });
    }

    console.log("Existing Subscription:", existingSubscription);
    console.log("hi");
    console.log("Converted userId:", userId);

    const newSubscription = new Subscription({
      userId: userId,
      packageName,
      compositeId,
      validFrom,
      validTo,
      paymentStatus,
      status: 'active'
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully', subscription: newSubscription });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    await Subscription.updateMany(
      { userId, validTo: { $lt: now }, status: 'active' },
      { $set: { status: 'expired' } }
    );

    const subscriptions = await Subscription.find({ userId });
    res.json(subscriptions);

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/currentSubscription/:userId', async (req, res) => {
    let { userId } = req.params;

    console.log("🛠 Received userId:", userId); 

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    try {
        const subscription = await Subscription.findOne({
            userId: objectId,
            status: 'active',
            paymentStatus: 'completed'
        });

        if (!subscription) {
            return res.json({ message: 'No active subscription found', hasSubscription: false });
        }

        res.json({
            success: true,
            hasSubscription: true,
            subscription: {
                planName: subscription.packageName,
                validity: `${subscription.validFrom.toISOString().split('T')[0]} - ${subscription.validTo.toISOString().split('T')[0]}`
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

module.exports = router;