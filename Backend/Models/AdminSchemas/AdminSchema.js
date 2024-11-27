const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({   
    addedBy:{
        type:String,
        required:true,
    },
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
    status:{
        type: String,
        enum:['Enabled, Disabled'],
    }
    
}, { timestamps: true});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;