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
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Assigned', 'No-Show'],
        default: 'Pending'
    }
    
}, { timestamps: true});


const Schedule = mongoose.model('reservations', RoomReservations);

module.exports = Schedule;

