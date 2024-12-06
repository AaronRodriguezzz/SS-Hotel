const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomType: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    checkInDate: {
        type: String,
        required: true,
    },
    checkOutDate: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    guestCount: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum:['Available', 'Occupied', 'Maintenance', 'Cleaning']
    },  
    
}, { timestamps: true});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;