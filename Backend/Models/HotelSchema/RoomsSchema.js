const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    roomDescription: {
        type: String,
        required: true,
    },
    roomLimit: {
        type: Number,
        required: true,
    },
    maximumGuest: {
        type: Number,
        required: true,
    },
    key: {
        type: Number,
        required: true,
        unique: true,
    },  
}, { timestamps: true,  collection: 'RoomInfo'});

const Room = mongoose.model('RoomInfo', roomSchema);

module.exports = Room;