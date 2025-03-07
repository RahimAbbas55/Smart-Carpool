const express = require('express');
const { connect } = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io')
const passengerRoutes = require('./routes/passengerRoutes');
const requestRoutes = require('./routes/requestRoutes');
const driverRoutes = require('./routes/driverRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/driver', driverRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/request', requestRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
module.exports = io;