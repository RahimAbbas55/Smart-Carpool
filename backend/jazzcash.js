const Jazzcash = require('jazzcash-checkout');
const dotenv = require('dotenv');

dotenv.config();

// Initialize JazzCash credentials from environment variables
Jazzcash.credentials({
  config: {
    merchantId: process.env.MERCHANT_ID, // Merchant ID
    password: process.env.PASSWORD,     // Password
    hashKey: process.env.HASH_KEY,      // Hash Key
  },
  environment: 'sandbox', // Use 'live' for production
});

// Define JazzCash operations
const JC = {
  wallet: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest('WALLET').then(res => {
      res = JSON.parse(res);
      console.log(res);
      callback(res);
    });
  },

  pay: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest('PAY').then(res => {
      console.log(res);
      callback(res);
    });
  },

  refund: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest('REFUND').then(res => {
      res = JSON.parse(res);
      console.log(res);
      callback(res);
    });
  },

  inquiry: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest('INQUIRY').then(res => {
      res = JSON.parse(res);
      console.log(res);
      callback(res);
    });
  },
};

module.exports = JC;