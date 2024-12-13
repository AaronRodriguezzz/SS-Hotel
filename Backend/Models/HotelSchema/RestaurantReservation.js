const mongoose = require('mongoose');

const RestaurantReservation = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    guestQuantity: {
        type: Number,
        required: true,
    },

}, { timestamps: true});

const RestauReservation = mongoose.model('Restaurant', RestaurantReservation);
module.exports = RestauReservation;
