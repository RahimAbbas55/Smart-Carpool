const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    passengerId: {
        type: String,
        required: true
    },
    driverPassword: {
        type: String,
        required: [true , 'Password required']
    },
    driverEmail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    driverPhone: {
        type: String,
        required: [true, 'Phone is required']
    },
    driverFirstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    driverLastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    driverDOB: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    driverCnicFront: {
        type: String,
        required: [true, 'CNIC Front is required']
    },
    driverCnicBack: {
        type: String,
        required: [true, 'CNIC Back is required']
    },
    driverCnicNumber: {
        type: String,
        required: [true, 'CNIC Number is required']
    },
    driverSelfie: {
        type: String,
        required: [true, 'Selfie is required']
    },
    vehicleRegisterationFront: {
        type: String,
        required: [true, 'Vehicle Registration Front is required']
    },
    vehicleRegisterationBack: {
        type: String,
        required: [true, 'Vehicle Registration Back is required']
    },
    vehicleProductionYear: {
        type: String,
        required: false
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required']
    },
    carType: {
        type: String,
        required: [true, 'Car type is required']
    },
    vehiclePhotos: {
        type: [String],
        required: false
    },
    rating: {
        type: Number,
        default: 0 
    },
    vehicleName: {
        type: String,
        required: [true, 'Vehicle Name is required']
    },
    vehicleColor: {
        type: String,
        required: [true, 'Vehicle Color is required']
    },
    licenseNumber: {
        type: String,
        required: [true, 'License Number is required']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required']
    }
});

const Driver = mongoose.model('Driver', driverSchema, 'drivers');
module.exports = Driver;
