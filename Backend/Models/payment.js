const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    reservation_id: {
        type: String, 
        required: true
    },
    payment_checkout_id: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Completed',
        enum: ['Completed', 'Refunded']
    }
    
}, { timestamps: true});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;