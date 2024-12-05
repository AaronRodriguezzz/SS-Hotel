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



const specific_room_schedule = async (req,res) => {
    const room = req.params; // Access query parameter

    try{
        const specificRoom = await RoomNumbers.find({roomType:roomType});

        if(!specificRoom){
            return res.status(404).json({message:"Empty Room"});
        }

        return res.status(200).json({specificRoom});

    }catch(err){
        console.log('Available room error: ', err);
    }
}

const fetchRoomNum = async (req,res) => {
    
    const roomNums = await RoomNumbers.find();
    
    if(!roomNums){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({roomNums});
}

const fetchAvailableRooms = async (req,res) => {
    const {roomType} = req.params; // Access query parameter

    try{
        const availableRooms = await RoomNumbers.find({roomType:roomType, status:'Available'});


        if(!availableRooms){
            return res.status(404).json({message:"Empty Room"});
        }

        return res.status(200).json({availableRooms : availableRooms});
    }catch(err){
        console.log('Available room error: ', err);
    }
}





module.exports = {
    fetchRoom,
    fetchSchedule,
    fetchRoomNum,
    fetchAvailableRooms,
    specific_room_schedule
};