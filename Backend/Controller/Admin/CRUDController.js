const Admin = require('../../Models/AdminSchemas/AdminSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');
const RoomNums = require('../../Models/HotelSchema/RoomNumber');
const History = require('../../Models/AdminSchemas/RecycleBin');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const Payment = require('../../Models/payment');
const { getPaymentId, refundPayment } = require('../../services/paymentService');


const addAdmin = async (req,res) => {
    const {email,lastName, firstName} = req.body;

    try{
        const emailExist = await Admin.findOne({email: email});
    
        if(emailExist){
           return res.status(404).json({message:"Email already exists"});
        }

        const code = Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
        const hashedPassword = await bcrypt.hash(String(code), 10);


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS,
                },
            });
              
              // async..await is not allowed in global scope, must use a wrapper
                // send mail with defined transport object
            const info = await transporter.sendMail({
                from: "SilverStone Hotel Management", 
                to: email, 
                subject: "SilverStone Account", 
                text: `Greetings, ${lastName} , ${firstName}! 
                    \n
                    \n Welcome to our growing SilverStone Hotel family staff. We hope you're in a good condition.
                    \n We would like to congratulate you for passing our screening. This email's purpose is to send you 
                    your account for our system. Please don't share your account to anyone to avoid  breaching your contact
                    \n Email: ${email} 
                    \n Code: ${code} 
                    \n
                    \n
                    Sincerely Yours, 
                    SilverStone Management`, 
            });
    
            if(!info){
                return res.status(500).json({message: 'Sending Email failed'});
            }   

            console.log(req.body);

            const newAdmin = new Admin({
                password: hashedPassword,
                ...req.body
            })
            
            await newAdmin.save();
              
            return res.status(200).json({message: 'New Account Successfully Added'});
        

    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Adding new account failed'});
    }
}


const processReservation = async (req, res) => {
    const {reservation, selectedRoom,adminName} = req.body;

    console.log('seleceted rooms' , selectedRoom);
    console.log('reservation' , reservation);

    try{
        
        const roomUpdates = await selectedRoom.map(async (room) => 

            await RoomNums.findOneAndUpdate(
                { roomNumber: room },
                {
                    clientName: reservation.guestName,
                    checkInDate: reservation.checkInDate,
                    checkOutDate: reservation.checkOutDate,
                    contactNumber: reservation.guestContact,
                    guestCount: reservation.totalGuests,
                    status: 'Occupied',
                }
            )
        );


        const processReservationResults = await Promise.all(roomUpdates);

        if (processReservationResults.some(result => !result)) {
            console.log('Updating Rooms Error');
            return res.status(404).json({ message: 'Updating Rooms Error' });
        }

        const roomsAssigned = selectedRoom.join(', ');
        const addToBin = new History({
            updatedBy: adminName,
            ...reservation,
            roomAssigned: roomsAssigned,
            remarks: 'Completed',
        });
        
        const isRoomAssigned = await addToBin.save();

        if(!isRoomAssigned){
            console.log('Error adding to History');
            return res.status(404).json({message:'Add to Bin Failed'});
        }
       
        const delReservation = await RoomSchedule.findOneAndDelete({_id: reservation._id});

        if(delReservation){
            return res.status(200).json({message: 'Assigning to room/s Successful'});
        }

    }catch(err){
        console.log('Process Reservation Error: ', err);
    }
}

const updateRole = async (req,res) => {
    const { updatedRole, id } = req.body;

    try{
        const admin = await Admin.findOne({ _id: id });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the role field of the admin
        const updatedAdmin = await Admin.findOneAndUpdate(
            { _id: id },
            { $set: { role: updatedRole } },
            { new: true }  // Return the updated admin document
        );

        // Respond with the updated admin data
        return res.status(200).json({
            message: 'Role updated successfully',
            admin: updatedAdmin,
        });
            
            
    }catch(err){
        console.log('Update Role Error: ', err);
        return res.status(500)
    }
}

const updateStatus = async (req,res) => {
    const {toChange, id} = req.body;
    try{
        const admin = await Admin.findOne({ _id: id });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the role field of the admin
        const updatedAdmin = await Admin.findOneAndUpdate(
            { _id: id },
            { $set: { adminStatus: toChange } },
            { new: true }  // Return the updated admin document
        );

        // Respond with the updated admin data
        return res.status(200).json({
            admin: updatedAdmin,
        });
            
            
    }catch(err){
        console.log('Update Role Error: ', err);
        return res.status(500)
    }
}


const processCancellation = async (req, res) => {
    const {id} = req.params;
     const token  = req.cookies.jwt;
    
    if(!token){
        return res.status(401).json({ message: 'Token invalid'});
    }
    
    const decodedToken= jwt.verify(token, process.env.JWT_SECRET);
    try{
        const admin = await Admin.findOne({email: decodedToken.email })
        if(!admin) throw new Error('Admin not found');
        const bin = new History({
            ...req.body,
            roomAssigned: 'N/A',
            updatedBy: admin.firstName
        })

        const reservation = await RoomSchedule.findByIdAndDelete(id);

        if(!reservation){
            return res.status(404).json({message: 'Failed to Cancel'});
        }

        const payment = await Payment.findOne({reservation_id: id});
        console.log(payment)
        if(payment){
            payment.status = 'Refunded';
            if(payment.payment_checkout_id){
                const paymongoPaymentId = await getPaymentId(payment.payment_checkout_id);
                if(!paymongoPaymentId) throw new Error('Paymongo Payment Id not found');
    
                const refund = await refundPayment(paymongoPaymentId, payment.totalPrice)
                if(!refund) throw new Error('Refund failed');
            }
            await payment.save();
        }

        await bin.save();
        if(!bin) throw new Error('Cancellation error'); 
        res.status(200).json({message: 'Cancellation success'});
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}

const processCheckOut = async (req, res) => {
    try{
        const roomNum = await RoomNums.findOneAndUpdate(
            { roomNumber: req.params.roomNum },
            {
                clientName: '',
                checkInDate: '',
                checkOutDate: '',
                contactNumber: '',
                guestCount: '',
                status: 'Available',
            }
        )
        if(!roomNum) throw new Error('Room not found');

        res.status(200).json({message: 'Checkout successful'})
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const delete_admin = async (req,res) => {
    const {id} = req.params

    try{
        const admin = await Admin({_id: id});
        
        if(!admin){
            return res.status(404).json({message: 'Admin doesn\'t exist'})
        }
        
        await Admin.findOneAndDelete({_id: id})

        return res.status(200).json({message: 'Admin deletion successful'})
    }catch(err){
        res.status(500).json({message: 'Admin deletion failed'})
        console.log(err);
    }
}

const delete_due_reservations = async (req, res) => {
   /* const duesReservation = req.body; 
    console.log('helow' , duesReservation)
    try {
        const roomUpdates = await Promise.all(
            duesReservation.map(async (reservation) => {

                const deletedRoom = await RoomSchedule.findOneAndDelete({ checkOutDate: reservation.checkOutDate });
                
                if (!deletedRoom) {
                    throw new Error(`No room found with checkOutDate: ${reservation.checkOutDate}`);
                }

                // Add to history bin
                const addToBin = new History({
                    updatedBy: 'N/A',
                    ...reservation,
                    roomAssigned: 'N/A',
                    remarks: 'No-Show',
                });

                await addToBin.save();
                return true; // Indicating success
            })
        );

        console.log('room updates', roomUpdates);
        // If all operations succeeded
        return res.status(200).json({ message: "Reservations processed successfully", roomUpdates });

    } catch (err) {
        console.error("Error processing reservations:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }*/
};


module.exports = {
    addAdmin,
    processReservation,
    processCancellation,
    updateRole,
    updateStatus,
    processCheckOut,
    delete_admin,
    delete_due_reservations
}