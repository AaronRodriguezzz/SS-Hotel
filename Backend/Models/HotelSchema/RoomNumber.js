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
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        unique: true,
    },  
    
}, { timestamps: true,  collection: 'RoomInfo'});

const Room = mongoose.model('RoomInfo', roomSchema);

module.exports = Room;