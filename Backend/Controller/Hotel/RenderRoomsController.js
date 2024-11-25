const RoomInfo = require('../../Models/HotelSchema/RoomsSchema');

const renderRooms = async (req,res) => {
    const key = req.params.key;    
    
    try{

        const rooms = await RoomInfo.findOne({key});

        if(!rooms){
            return res.status(404).json('No Rooms');
        }

        return res.status(200).json(rooms);
        
    }catch(err){
        res.status(500).json('error' , { message: err.message });
    }
}

module.exports = {
    renderRooms
}