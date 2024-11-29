require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RenderRooms = require('./Routes/HotelRoutes/RenderingRoomRoutes');
const Reservation = require('./Routes/HotelRoutes/ReservationRoutes')
const Admin = require('./Routes/AdminRoutes/FetchRoomData')
const SuperAdmin = require('./Routes/AdminRoutes/SuperAdminFetch')
const AdminCrud = require('./Routes/AdminRoutes/CRUDRoute')
const AdminLogin = require('./Routes/AdminRoutes/AdminLogInRoute')
const app = express();

 mongoose.connect(process.env.dbURI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Listening on port', process.env.PORT)
            console.log('Connected to the Database');
        })    
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));


app.use((req,res,next) => {
    console.log(req.path, req.method);
    next()
})

//Routes Usage
app.use(RenderRooms);
app.use(AdminLogin);
app.use(AdminCrud);
app.use(SuperAdmin);
app.use(Reservation);
app.use(Admin);



process.env