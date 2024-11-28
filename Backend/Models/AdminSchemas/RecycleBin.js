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
        require: true,
    },
    totalGuests: {
        type: Number,
        require: true,
    },
    totalPrice: {
        type: Number,
        require: true,
    },
    roomAssigned: {
        type: String,
        require: true,
    },
    remarks: {
        type: String,
        require: true,
        enum:['Cancelled', 'Completed']
    }
},{ timestamps: true});

const Bin = mongoose.model('Recycle Bin', recycleBin);
module.exports = Bin;