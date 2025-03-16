const express = require('express');
const { connect } = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const passengerRoutes = require('./routes/passengerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const singleRideRoutes = require('./routes/SingleRideRoute');
const carpoolRideRoutes = require('./routes/CarpoolRideRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/driver', driverRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/singleRide' , singleRideRoutes)
app.use('/api/carpoolRide' , carpoolRideRoutes)

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));