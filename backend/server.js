const { connect } = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const twilio = require("twilio");
const JC = require('./jazzcash');
const passengerRoutes = require("./routes/passengerRoutes");
const driverRoutes = require("./routes/driverRoutes");
const singleRideRoutes = require("./routes/SingleRideRoute");
const carpoolRideRoutes = require("./routes/CarpoolRideRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const driverComplaintRoutes = require("./routes/driverComplaintRoute")
const rideHistoryRoutes = require("./routes/rideHistoryRoute");
const packagesRoutes = require("./routes/packageRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const accountRoutes = require('./routes/AccountRoutes');
const passengerRatingRoutes = require('./routes/ratingRoutes')

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const API_KEY = process.env.IMG_API_KEY; 
const IMG_UPLOAD_URL = process.env.IMG_UPLOAD_URL;
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Load the credentials file
const credentials = require('./smart-carpool-diagflow.json');
const projectId = credentials.project_id;

// Initialize Dialogflow client with keyFilename for direct authentication
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './smart-carpool-diagflow.json'
});

app.post("/pay", (req, res) => {
  console.log("Request body:", req.body);
  const data = {
    pp_Version: "1.1",
    pp_ReturnURL: `${process.env.NGROK_URL}/payment/callback`,
    pp_Amount: req.body.pp_Amount,
    pp_TxnCurrency: "PKR",
    pp_BillReference: "billRef123",
    pp_Description: req.body.pp_Description,
  };
  console.log("Data to send to JazzCash:", data);
  JC.pay(data, (response) => {
    try {
      console.log("JazzCash Response:", response);
      if (response.pp_SecureHash) {
        console.log("Payment Successful:", response);
        res.status(200).json({ success: true, response });
      } else {
        console.log("Payment Failed:", response);
        res.status(400).json({ success: false, response });
      }
    } catch (error) {
      console.error("Error processing JazzCash response:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
});

app.post("/payment/callback", (req, res) => {
  const paymentResponse = req.body;
  console.log("JazzCash Callback Response:", paymentResponse);
  if (paymentResponse.pp_ResponseCode === "000") {
    console.log("Payment Successful:", paymentResponse);
  } else {
    console.log("Payment Failed:", paymentResponse.pp_ResponseMessage);
  }
  res.sendStatus(200);
});

app.post("/send-otp", async (req, res) => {
  console.log(req.body)
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ message: "OTP Sent", sid: verification.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  console.log("Verifying OTP for:", phone, "with code:", code);

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    console.log("Verify Service SID:", process.env.TWILIO_VERIFY_SERVICE_SID);
    console.log("Twilio Response:", verificationCheck);

    if (verificationCheck.status === "approved") {
      return res.json({ message: "OTP Verified Successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Dialogflow chatbot endpoint with improved error handling
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const sessionId = uuid.v4(); 
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };
  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText || 'Sorry, I can not process your request at the moment. Please try again later!'});
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

app.use(cors());
app.use(express.json());

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/driver", driverRoutes);
app.use("/api/passenger", passengerRoutes);
app.use("/api/singleRide", singleRideRoutes);
app.use("/api/carpoolRide", carpoolRideRoutes);
app.use('/api/driver-contact-us', driverComplaintRoutes);
app.use("/api/contactus", complaintRoutes);
app.use("/api/history", rideHistoryRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/passengerRating', passengerRatingRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);