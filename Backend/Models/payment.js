const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    reservation_id: {
        type: String,
        required: true
    },
    checkout_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Paid', 'Refunded'],
        default: 'Paid'
    }
   
}, { timestamps: true,  collection: 'RoomInfo'});

const payment_check_out = mongoose.model('Payment_Checkout', paymentSchema);

module.exports = payment_check_out;