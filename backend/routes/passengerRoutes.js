const express = require('express');
const Passenger = require('../models/Passenger');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const jwt_token_secret = process.env.JWT_SECRET;

// Simple test route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Passenger API is working!' });
});

router.post('/signup', async (req, res) => {
  const { name, email, phone, password , gender} = req.body;

  try {
    const existingUser = await Passenger.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPassenger = new Passenger({
      name,
      email,
      phone,
      password: hashedPassword,
      gender
    });

    await newPassenger.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Passenger.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ email: user.email }, jwt_token_secret, { expiresIn: '5h' });
    // Return success response with the token
    return res.status(201).json({
      status: 'ok',
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const tokenExpiry = Date.now() + 15 * 60 * 1000;

    passenger.resetToken = resetToken;
    passenger.resetCode = resetCode;
    passenger.tokenExpiry = tokenExpiry;
    await passenger.save();  

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      port: 465,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Your password reset code is: ${resetCode}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset code sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/changepassword', async (req, res) => {
  const { resetCode, newPassword } = req.body;

  try {
    const passenger = await Passenger.findOne({ resetCode });

    if (!passenger || passenger.tokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    passenger.password = hashedPassword;
    passenger.resetToken = null;
    passenger.resetCode = null;
    passenger.tokenExpiry = null;

    await passenger.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/updateWallet', async (req, res) => {
  let { email, amount } = req.body; //
  amount = Number(amount); 
  console.log("request body", req.body);
  console.log("amount ",amount);
  if (isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount value" });
  }

  try {
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    if (typeof passenger.wallet !== 'number' || isNaN(passenger.wallet)) {
      passenger.wallet = 0; 
    }

    passenger.wallet += amount; 
    await passenger.save();
    res.json({ success: true, wallet: passenger.wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the wallet' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await Passenger.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { name, phone, wallet, gender } = user;

    return res.status(200).json({ name, email, phone, wallet, gender });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/updateUser', async (req, res) => {
  const { email, name, phone, password, profileImage } = req.body;
  console.log("settings backend", req.body);

  try {
    const user = await Passenger.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only non-empty fields
    if (name !== undefined && name.trim() !== "") user.name = name;
    if (phone !== undefined && phone.trim() !== "") user.phone = phone;

    // Check if the received password is different from the stored one and not already hashed
    if (password !== undefined && password.trim() !== "") {
      const isHashed = password.startsWith("$2b$"); // bcrypt hashed passwords start with $2b$
      if (!isHashed) {
        user.password = await bcrypt.hash(password, 10);
      }
    }

    if (profileImage !== undefined && profileImage.trim() !== "") user.imageUrl = profileImage;

    const updatedUser = await user.save();
    console.log("updatedUser", updatedUser);
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

router.get('/getpassengerImage', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const passenger = await Passenger.findOne({ email });

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found.' });
    }

    res.status(200).json({ imageUrl: passenger.imageUrl });
  } catch (error) {
    console.error('Error fetching passenger image:', error);
    res.status(500).json({ error: 'Failed to fetch passenger image.' });
  }
});

//fetching user data after their authentication
router.post('/userData' , async (req , res) => {
  const { token } = req.body;
  try{
    const user = jwt.verify(token , jwt_token_secret);
    const userEmail = user.email;
    await Passenger.findOne({ email : userEmail }).then((data) => {
      return res.send({ status: 'ok' , data : data });
    });
  } catch (error){
    return res.send({ error: error.message }); 
  }
})

module.exports = router;
