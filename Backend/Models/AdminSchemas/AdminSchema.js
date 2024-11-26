const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNum: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin'],  // Possible roles; adjust as needed
    },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;