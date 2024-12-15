const nodemailer = require('nodemailer');
const History = require('../../Models/AdminSchemas/RecycleBin');
const AdminAccts = require('../../Models/AdminSchemas/AdminSchema');


const fetchHistory = async (req,res) => {
    
    const history = await History.find().sort({createdAt: -1});
    
    if(!history){
       return res.status(404).json({message:"Empty Room"});
    }
    console.log(history)

    return res.status(200).json({history});
}

const fetchAdmin = async (req,res) => {
    
    const adminAccts = await AdminAccts.find();
    
    if(!adminAccts){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({adminAccts});
}

module.exports = {
    fetchHistory,
    fetchAdmin
};