require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const RenderRooms = require('./Routes/HotelRoutes/RenderingRoomRoutes');
const Reservation = require('./Routes/HotelRoutes/ReservationRoutes');
const Restaurant = require('./Routes/HotelRoutes/RestaurantReservationRoute');
const Admin = require('./Routes/AdminRoutes/FetchRoomData')
const SuperAdmin = require('./Routes/AdminRoutes/SuperAdminFetch')
const AdminCrud = require('./Routes/AdminRoutes/CRUDRoute')
const AdminLogin = require('./Routes/AdminRoutes/AdminLogInRoute')
const PaymentRoutes = require('./Routes/PaymentRoutes/paymentRoutes');
const ChatbotRoute = require('./Routes/AiRoute/ChatBotRoute');

const app = express();
const morgan = require('morgan');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));
app.use(express.json());       
app.use(cookieParser());   
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
app.use(Restaurant)
app.use(ChatbotRoute);
app.use(Admin);
app.use(PaymentRoutes);

process.env
const dirname = path.resolve();

// Now you can use dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
}


mongoose.connect(process.env.dbURI)
    .then(() => {
        app.listen(process.env.PORT || 4001, () => {
            console.log('Listening on port', process.env.PORT)
            console.log('Connected to the Database');
        })    
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });