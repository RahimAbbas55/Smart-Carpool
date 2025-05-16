const express = require("express");
const Complaint = require("../models/Complaint");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, complaint, driverId: userId } = req.body;
    const compositeId = `CM-${Date.now()}`;
    console.log(name, email, phone, complaint, userId)
    const newComplaint = new Complaint({
      complaint,
      email,
      name,
      phone,
      userId,
      compositeId,
    });

    await newComplaint.save();

    res
      .status(201)
      .json({ message: "Complaint submitted successfully", compositeId });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
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
      subject: "Your Complaint Has Been Received - Smart Carpool Support",
      text: `
        Dear ${name},

        Thank you for reaching out to Smart Carpool Support. We have successfully received your complaint.

        📌 Complaint Details:
        - Complaint ID: ${compositeId}
        - Name:${name}
        - Phone: ${phone}
        - Email: ${email}
        - Complaint: ${complaint}

        🔎 What Happens Next?
        Our support team will review your complaint and get back to you within 48-64 hours. You can refer to your Complaint ID (${compositeId}) for any future inquiries.

        If you need immediate assistance, feel free to reply to this email or contact our support team.

        Best regards,  
        🚗 Smart Carpool Support Team  
        📧 smartcarpool1@gmail.com  
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
