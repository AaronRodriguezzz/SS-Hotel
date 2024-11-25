const mongoose = require('mongoose');

const RoomReservations = new mongoose.Schema({
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
   
}, { timestamps: true});

const Schedule = mongoose.model('Reservation', RoomReservations);

module.exports = Schedule;

