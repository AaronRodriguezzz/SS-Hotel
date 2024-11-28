const nodemailer = require('nodemailer');
const History = require('../../Models/AdminSchemas/RecycleBin');
const AdminAccts = require('../../Models/AdminSchemas/AdminSchema');


const fetchHistory = async (req,res) => {
    
    const history = await History.find();

    
    if(!history){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({history});
}


module.exports = {
    fetchHistory,
};