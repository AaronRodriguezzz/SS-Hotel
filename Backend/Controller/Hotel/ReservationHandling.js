const nodemailer = require('nodemailer');
const RoomInfo = require('../../Models/HotelSchema/RoomsSchema');
const Payment = require('../../Models/payment');
const ReservationSchedule = require('../../Models/HotelSchema/RoomSchedules');
const jwt = require('jsonwebtoken');
const { sendBookingDetails } = require('../../services/emailService');
const Admin = require('../../Models/AdminSchemas/AdminSchema');
const Notification = require('../../Models/AdminSchemas/Notification');
const { socketInstance, sendNotification } = require('../../socket/socket');

const url = process.env.NODE_ENV === 'production' ? 'https://ss-hotel.onrender.com' : 'http://localhost:5173/';

const AvailableRoomSearch = async (req, res) => {
    const { checkInDate, checkOutDate } = req.body;
    try {
        // Convert check-in and check-out dates to Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (checkIn) {
            checkIn.setHours(0, 0, 0, 0);  
        }
        if (checkOut) {
            checkOut.setHours(23, 59, 59, 999); 
        }
        

        const gap = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const schedules = await ReservationSchedule.find({ 
            status: {$in: ['Pending', 'Assigned']},
            checkInDate: { $lte: checkOut, $gte: checkIn }, 
            checkOutDate: { $gte: checkIn } 
        });
        
        const rooms = await RoomInfo.find();
        schedules.forEach(schedule => {
            rooms.forEach(room => {
                if(schedule.roomType === room.roomType){
                    room.roomLimit -= 1;
                }
            })
        })

        return res.status(200).json({ roomAvailable: rooms , schedule: schedules, gap });

    } catch (err) {
        // Send an error response with the error message
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};



const NewReservation = async (req,res) => {
    const reservationData = jwt.verify(req.cookies.checkoutData, process.env.JWT_SECRET);
    const {stateData, rooms, payment_checkout_id}  = reservationData; 

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
                totalGuests: reservation.maximumGuest,
                totalPrice: reservation.price * reservation.daysGap,
            });
            
            if(!newReservation) throw new Error('Reservation failed');
            const newPayment = new Payment({
                reservation_id: newReservation._id,
                payment_checkout_id,
                totalPrice: reservation.price * reservation.daysGap
            }) 
            await newPayment.save();
            await newReservation.save();

            const admins = await Admin.find();

            let notification;

            for(const admin of admins){
                notification = await Notification.create({email: admin.email, message: `New reservation for ${reservation.roomType} room`})
            }
            sendNotification(notification)
        }

        res.clearCookie('checkoutData', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production'  
        });
        await sendBookingDetails(stateData.email, Array.from(rooms), {
            guestName: stateData.fullName,
            guestContact: stateData.phoneNumber,
        }  )

        res.redirect(url);

    }catch(err){
        console.log('reservation err: ', err);
        res.status(500).json({ message: err.message });
    }
}


const AdminNewReservation = async (req,res) => {
    const reservationData = req.body;
    const {stateData, rooms}  = reservationData; 
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
            const newPayment = new Payment({
                reservation_id: newReservation._id,
                totalPrice: reservation.price * reservation.gap
            }) 
            await newPayment.save();
            await newReservation.save();
        }
        await sendBookingDetails(stateData.email, Array.from(rooms), {
            guestName: stateData.fullName,
            guestContact: stateData.phoneNumber,
        })
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

module.exports = {
    AvailableRoomSearch,
    NewReservation,
    AdminNewReservation,
    get_verification_code,
}