const mongoose = require('mongoose');
const driverSchema = new mongoose.Schema({
    driverEmail: {
        type: String,
        required: [true, 'Email is required']
    },
    driverPhone: {
        type: String,
        required: [true, 'Phone is required']
    },
    driverPassword: {
        type: String,
        required: [true, 'Password is required']
    },
    driverPhoto:{
        type: String,
        required: [true, 'Photo is required']
    },
    driverFirstName:{
        type: String,
        required: [true, 'First Name is required']
    },
    driverLastName:{
        type: String,
        required: [true, 'Last Name is required']
    },
    driverDOB:{
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    driverGender:{
        type: String,
        required: [true, 'Gender is required']
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
        required: [true, 'Vehicle Registeration Front is required']
    },
    vehicleRegisterationBack: {
        type: String,
        required: [true, 'Vehicle Registeration Back is required']
    },
    vehicleProductionYear: {
        type: String,
        required: false
    }

});

const Driver = mongoose.model('Driver', driverSchema, 'drivers');
module.exports = Driver;