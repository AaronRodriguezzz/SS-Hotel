const Rooms = require('../../Models/HotelSchema/RoomsSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');
const RoomNumbers = require('../../Models/HotelSchema/RoomNumber');
const Restaurant = require('../../Models/HotelSchema/RestaurantReservation');

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

        if(!specificRoom){
            return res.status(404).json({message:"Empty Room"});
        }

        console.log(specificRoom);
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

const Available_Search_WalkIn = async (req,res) => {
    const { checkInDate, checkOutDate } = req.body;
    try {
        // Convert check-in and check-out dates to Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const gap = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        const RoomSchedules = await RoomSchedule.find({status: 'Pending'});
        const roomAvailable = RoomSchedules.filter(sched => {
            return (checkIn >= sched.checkOutDate || checkOut <= sched.checkInDate);
        });

        const rooms = await Rooms.find();

        for (let i = 0; i < roomAvailable.length; i++) {
            // Loop through rooms and update roomLimit
            for (let j = 0; j < rooms.length; j++) {
                if (roomAvailable[i].roomType === rooms[j].roomType) {
                    rooms[j].roomLimit += roomAvailable[i].totalRooms;
                }
            }
        }

        return res.status(200).json({ roomAvailable:rooms , gap });

    } catch (err) {
        // Send an error response with the error message
        console.log(err);
        return res.status(500).json({ message: err.message });
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
    Available_Search_WalkIn,
    handle_available_roomNum,
    get_restaurant_reservation
};