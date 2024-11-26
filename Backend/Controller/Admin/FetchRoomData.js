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


module.exports = {
    fetchRoom,
    fetchSchedule,
    fetchRoomNum,
};