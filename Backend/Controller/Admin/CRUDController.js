const Admin = require('../../Models/AdminSchemas/AdminSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');
const RoomNums = require('../../Models/HotelSchema/RoomNumber');
const History = require('../../Models/AdminSchemas/RecycleBin');
const Payment = require('../../Models/payment');
const RoomInfo = require('../../Models/HotelSchema/RoomsSchema');
const Restaurant = require('../../Models/HotelSchema/RestaurantReservation');
const { getPaymentId, refundPayment } = require('../../services/paymentService');
const url = process.env.NODE_ENV === 'production' ? 'https://ss-hotel.onrender.com' : 'http://localhost:5173';
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

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


const forgetPassword = async (req,res) => { 
    const  { employeeEmail }  = req.body

    try{
        
        const emailExist = await Admin.findOne({email:employeeEmail})

        if(!emailExist){
           return res.status(404).json({message:"Email don't exists"});
        }

        

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });


        const info = await transporter.sendMail({
            from: "SilverStone Hotel Management", 
            to: employeeEmail, 
            subject: "SilverStone Account", 
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Greetings, ${emailExist.lastName}, ${emailExist.firstName}!</h2>
                    <p>Welcome to our growing SilverStone Hotel family staff. We hope you're in good condition.</p>
                    <p>
                        If you'd like to request a new password, click the button below:
                    </p>
                    <a 
                        href="${url}/api/reset-password/${encodeURIComponent(employeeEmail)}"
                        style="
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background-color: #007bff;
                            text-decoration: none;
                            border-radius: 5px;
                        "
                        target="_blank"
                    >
                        Request New Password
                    </a>
                    <p>Best Regards,</p>
                    <p>SilverStone Management</p>
                </div>
            `
        });
        
        if(!info){
            return res.status(404).json({message:"Error Sending new password"});
        }

        return res.status(200).json({message:"Password Updated"});

        
    }catch(err){
        console.log('forgot pass', err);
    }
}

const reset_password = async (req,res) => {
    const { email } = req.params; // Extract the email from the query string

    console.log('reset');
    try {
        // Generate a new password
        const code = Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
        const newPassword = await bcrypt.hash(String(code), 10);

        await Admin.findOneAndUpdate({email: email}, { $set: { password: newPassword }});

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });
       
        await transporter.sendMail({
            from: "SilverStone Hotel Management",
            to: email,
            subject: "Your New Password",
            text: `Your new password is: ${code}`
        });

        // Inform the user that their request was successful
        return res.status(200).json({message:'A new password has been sent to your email.'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
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

        const payment = await Payment.findOne({reservation_id: reservation._id});

        const roomsAssigned = selectedRoom.join(', ');
        const addToBin = new History({
            updatedBy: adminName,
            ...reservation,
            modeOfPayment: payment.payment_checkout_id ? 'Online Payment' : 'Cash',
            roomAssigned: roomsAssigned,
            remarks: 'Completed',
        });
        
        const isRoomAssigned = await addToBin.save();

        if(!isRoomAssigned){
            console.log('Error adding to History');
            return res.status(404).json({message:'Add to Bin Failed'});
        }
       
        const existedReservation = await RoomSchedule.findById(reservation._id);
        existedReservation.status = 'Assigned';
        await existedReservation.save();

        if(existedReservation){
            return res.status(200).json({message: 'Assigning to room/s Successful'});
        }

    }catch(err){
        console.log('Process Reservation Error: ', err);
    }
}

const delete_restaurant_reservation = async (req,res) => {
    const {id} = req.params;

    try{
        const reservation = await Restaurant.findOneAndDelete({_id: id});

        if(!reservation){
            return res.status(404).json({message: 'Delete Failed'})
        }

        const restaurant = await Restaurant.find();


        return res.status(200).json({message: 'Deleted', restaurant: restaurant})

    }catch(err){
        console.log(err);
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

        const payment = await Payment.findOne({reservation_id: id});

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

        const bin = new History({
            ...req.body,
            modeOfPayment: payment.payment_checkout_id ? 'Online Payment' : 'Cash',
            roomAssigned: 'N/A',
            updatedBy: admin.firstName
        })

        const reservation = await RoomSchedule.findById(id);
        reservation.status = 'Cancelled';
        if(!reservation){
            return res.status(404).json({message: 'Failed to Cancel'});
        }

        await reservation.save();
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

const handle_due_reservations = async (req, res) => {
    try {
        let today = new Date();
        
        const duesReservation = await RoomSchedule.find({checkInDate: {$lt: new Date(today.setHours(0, 0, 0, 0))}, status: 'Pending'});
            duesReservation.forEach(async (reservation) => {

                const updatedRoom = await RoomSchedule.findByIdAndUpdate(
                    reservation.id ,
                    { status: 'No-Show'}
                );
                if (! updatedRoom) {
                    throw new Error(`No room found with checkOutDate: ${reservation.checkOutDate}`);
                }

                const payment = await Payment.findOne({reservation_id: reservation._id})

                // Add to history bin
                const addToBin = new History({
                    updatedBy: 'N/A',
                    roomType: reservation.roomType,
                    checkInDate: reservation.checkInDate,
                    checkOutDate: reservation.checkOutDate,
                    guestName: reservation.guestName,
                    guestContact: reservation.guestContact,
                    guestEmail: reservation.guestEmail,
                    totalRooms: reservation.totalRooms,
                    totalGuests: reservation.totalGuests,
                    totalPrice: reservation.totalPrice,
                    modeOfPayment: payment.payment_checkout_id ? 'Online Payment' : 'Cash',
                    roomAssigned: 'N/A',
                    remarks: 'No-Show',
                });

                await addToBin.save();
                
            })
        // If all operations succeeded
        return res.status(200).json({ message: "Reservations processed successfully"});

    } catch (err) {
        console.error("Error processing reservations:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = {
    addAdmin,
    processReservation,
    processCancellation,
    updateRole,
    updateStatus,
    processCheckOut,
    delete_admin,
    handle_due_reservations,
    forgetPassword,
    reset_password,
    delete_restaurant_reservation
}