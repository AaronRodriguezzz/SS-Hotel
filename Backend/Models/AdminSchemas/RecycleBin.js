const mongoose = require('mongoose');

const recycleBin = new mongoose.Schema({
    updatedBy: {
        type: String,
        required: true,
    },
    roomType: {
        type: String,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    guestName: {
        type: String,
        required: true,
    },
    guestContact: {
        type: String,
        required: true,
    },
    guestEmail: {
        type: String,
        required: true,
    },
    totalRooms: {
        type: Number,
        required: true,
    },
    totalGuests: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    roomAssigned: {
        type: String,
        required: true,
    },
    modeOfPayment: {
        type: String,
        enum: ['Online Payment', 'Cash'],
        default: 'Online Payment',
        required: true,
    },
    remarks: {
        type: String,
        required: true,
        enum:['Cancelled', 'Completed']
    }
},{ timestamps: true});

const Bin = mongoose.model('Recycle Bin', recycleBin);
module.exports = Bin;