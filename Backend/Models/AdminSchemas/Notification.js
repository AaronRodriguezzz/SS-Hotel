const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Unread', 'Read'],
        default: 'Unread'
    }
    
}, { timestamps: true});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;