const Rooms = require('../../Models/HotelSchema/RoomsSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');
const RoomNumbers = require('../../Models/HotelSchema/RoomNumber');
const Restaurant = require('../../Models/HotelSchema/RestaurantReservation');
const RoomInfo = require('../../Models/HotelSchema/RoomsSchema');


const fetchRoom = async (req,res) => {
    
    const rooms = await Rooms.find();

    if(!rooms){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({rooms});
}

const fetchSchedule = async (req,res) => {
    const reservations = await RoomSchedule.find({status: 'Pending'}).sort({createdAt: -1});
    if(!reservations){
       return res.status(404).json({message:"Empty Room"});
    }

    return res.status(200).json({reservations});
}

const specific_room_schedule = async (req,res) => {
    const {room} = req.params; // Access query parameter

    try{
        const specificRoom = await RoomNumbers.find({roomType:room});
        const roomInfo = await RoomInfo.findOne({roomType: room});
        roomInfo.roomLimit = 2;
        await roomInfo.save();

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

const handle_available_roomNum = async (req,res) => {
    try{
        const roomNum = await RoomNumbers.find({ status: 'Available' });

        if(!roomNum) {
            return res.status(404).json({message: 'Room Nums Empty'});
        }

        return res.status(200).json({roomNum});
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Failed to fetch room nums'})
    }
}

const get_restaurant_reservation = async (req,res) => {
    try{
        const restaurant = await Restaurant.find();

        if(!restaurant){
            return res.status(404).json({message: 'Failed to fetch restaurant'})
        }

        return res.status(200).json({restaurant});
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    fetchRoom,
    fetchSchedule,
    fetchRoomNum,
    fetchAvailableRooms,
    specific_room_schedule,
    handle_available_roomNum,
    get_restaurant_reservation
};