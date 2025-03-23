const express = require("express");
const bcrypt = require("bcryptjs");
const Account = require("../models/Accounts");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, jazzCashNumber, mpin } = req.body;
    console.log(userId,jazzCashNumber,mpin);

    if (!userId || !jazzCashNumber || !mpin) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedMpin = await bcrypt.hash(mpin, 10);

    const newAccount = new Account({
      userId,
      jazzCashNumber,
      mpin: hashedMpin,
    });

    await newAccount.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const accounts = await Account.find({ userId });

    if (!accounts.length) {
      return res.status(404).json({ error: "No accounts found" });
    }

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/verify-mpin", async (req, res) => {
    try {
      const userId = req.body.userId || req.query.userId;
      const mpin = req.body.mpin || req.query.mpin;
      console.log("Received:", { userId, mpin });
  
      if (!userId || !mpin) {
        return res.status(400).json({ error: "User ID and MPIN are required" });
      }
        const account = await Account.findOne({ userId });
  
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
        const isMatch = await bcrypt.compare(mpin, account.mpin);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid MPIN" });
      }
  
      res.status(200).json({ message: "MPIN Verified" });
    } catch (error) {
      console.error("Error verifying MPIN:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;