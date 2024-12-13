const nodemailer = require('nodemailer');
const RoomInfo = require('../../Models/HotelSchema/RoomsSchema');
const ReservationSchedule = require('../../Models/HotelSchema/RoomSchedules');
const jwt = require('jsonwebtoken');

const url = process.env.NODE_ENV === 'production' ? 'https://silverstone-hotel.onrender.com' : 'http://localhost:5173/';

const AvailableRoomSearch = async (req, res) => {
    const { checkInDate, checkOutDate } = req.body;
    try {
        // Convert check-in and check-out dates to Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const gap = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        const RoomSchedules = await ReservationSchedule.find();
        const available = RoomSchedules.filter(sched => {
            return (checkIn >= sched.checkOutDate || checkOut <= sched.checkInDate);
        });


        const rooms = await RoomInfo.find();

        for (let i = 0; i < available.length; i++) {
            // Loop through rooms and update roomLimit
            for (let j = 0; j < rooms.length; j++) {
                if (available[i].roomType === rooms[j].roomType) {
                    rooms[j].roomLimit += available[i].totalRooms;
                }
            }
        }

        const filteredRooms = rooms.filter(room => {
            return(room.roomLimit !== 0)
        })

        return res.status(200).json({ roomAvailable:filteredRooms , schedule: available, gap });

    } catch (err) {
        // Send an error response with the error message
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};



const NewReservation = async (req,res) => {
    const reservationData = jwt.verify(req.cookies.checkoutData, process.env.JWT_SECRET);
    const {stateData, rooms}  = reservationData; 

    try{

        for (const reservation of rooms.entries()) {
            const checkIn = new Date(reservation.checkInDate);  
            const checkOut = new Date(reservation.checkOutDate);

            // Create the reservation and update room information
            const newReservation = new ReservationSchedule({
                roomType: reservation.roomType,
                checkInDate:checkIn,    
                checkOutDate:checkOut,
                guestName: stateData.fullName,
                guestContact: stateData.phoneNumber,
                guestEmail: stateData.email,
                totalRooms: 1,
                totalGuests: reservation.maximumGuest,
                totalPrice: reservation.price * reservation.daysGap,
            });
            await newReservation.save();
            await RoomInfo.findOneAndUpdate(
                { roomType: reservation.roomType },
                { $set: { roomLimit: reservation.roomLimit - 1 }}
            );
            
        }

        res.clearCookie('checkoutData', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production'  
        });

        res.redirect(url);

    }catch(err){
        console.log('reservation err: ', err);
        res.status(500).json({ message: err.message });
    }
}


const AdminNewReservation = async (req,res) => {
    const reservationData = req.body;
    const {stateData, rooms}  = reservationData; 
    console.log(reservationData);
    try{
        for (const [index, reservation] of rooms.entries()) {
            const checkIn = new Date(reservation.checkInDate);  
            const checkOut = new Date(reservation.checkOutDate);

            // Create the reservation and update room information
            const newReservation = new ReservationSchedule({
                roomType: reservation.roomType,
                checkInDate:checkIn,    
                checkOutDate:checkOut,
                guestName: stateData.fullName,
                guestContact: stateData.phoneNumber,
                guestEmail: stateData.email,
                totalRooms: 1,
                totalGuests: reservation.guestCount,
                totalPrice: reservation.price * reservation.gap,
            });
            await newReservation.save();
            await RoomInfo.findOneAndUpdate(
                { roomType: reservation.roomType },
                { $set: { roomLimit: reservation.roomLimit - 1 }}
            );
            
        }

        res.status(200).json({message: 'sucesss'});

    }catch(err){
        console.log('reservation err: ', err);
        res.status(500).json({ message: err.message });
    }
}

const get_verification_code = async (req,res) => {
    const {email} = req.params;

    try{
        const code = Math.floor(Math.random() * 9000) + 1000;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });
        
    
        const info = await transporter.sendMail({
            from: "SilverStone Hotel Reservations", // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            text: `Here's your verification code: ${code}`, 
        });
        
        console.log('backend code', code);
        return res.status(200).json({code});

    }catch(err){
        console.log('Error at sending verification', err);
    }
   
}


const DeleteReservation = async (req,res) => {
    
    try{
        
       
        
    }catch(err){
        res.status(500).json('error' , { message: err.message });
    }
}

const UpdateReservation = async (req,res) => {
    
    try{

       
        
    }catch(err){
        res.status(500).json('error' , { message: err.message });
    }
}

module.exports = {
    AvailableRoomSearch,
    NewReservation,
    AdminNewReservation,
    DeleteReservation,
    UpdateReservation,
    get_verification_code,
}