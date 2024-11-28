const Rooms = require('../../Models/HotelSchema/RoomsSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');
const RoomNumbers = require('../../Models/HotelSchema/RoomNumber');

const fetchRoom = async (req,res) => {
    
    const rooms = await Rooms.find();

    if(!rooms){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({rooms});
}

const fetchSchedule = async (req,res) => {
    
    const reservations = await RoomSchedule.find();


    if(!reservations){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({reservations});
}


const fetchRoomNum = async (req,res) => {
    
    const roomNums = await RoomNumbers.find();

    console.log(roomNums);
    
    if(!roomNums){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({roomNums});
}

const fetchAvailableRooms = async (req,res) => {
    const roomType = req.params; // Access query parameter

    const availableRooms = await RoomNumbers.find({roomType:roomType, status:'Available'});

    console.log('available' , availableRooms);
    
    if(!availableRooms){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({availableRooms});
}



module.exports = {
    fetchRoom,
    fetchSchedule,
    fetchRoomNum,
    fetchAvailableRooms
};