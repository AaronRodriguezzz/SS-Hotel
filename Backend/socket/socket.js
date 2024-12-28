const { Server } = require('socket.io');
const cookie = require('cookie');
const Notification = require('../Models/AdminSchemas/Notification');
const jwt = require('jsonwebtoken');

let socketInstance;

const initializeSocket = (server) => {
    const origin = process.env.NODE_ENV === 'production' ? 'https://ss-hotel.onrender.com' : 'http://localhost:5173';

    const io = new Server(server, {
        cors: {
            origin,
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        // Store the socket instance once a client connects
        socketInstance = socket;
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');

        // Get the 'jwt' token from the cookies
        const token = cookies.jwt;

        try {
            // Verify the JWT token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const email = decodedToken.email;

            console.log('User connected:', email);

            // Handle 'notifications' event
            socket.on('notifications', async (limit) => {
                try {
                    const total = await Notification.countDocuments({email});
                    const notifications = await Notification.find({ email })
                    .limit(limit)
                    .sort({createdAt: -1});
                    socket.emit('notifications', {notifications, total});
                } catch (err) {
                    console.log(err);
                }
            });

            socket.on('read', async() => {
                try{
                    await Notification.updateMany({email}, {status: 'Read'});

                }catch(err){
                    console.log(err);
                }
            })

            socket.on('disconnect', () => {
                console.log('User disconnected:', email);
            });

        } catch (err) {
            console.log('Error verifying token:', err);
        }
    });
};

const sendNotification = (notification) => {
    socketInstance.emit('notification', notification)
    
}

module.exports = { initializeSocket, sendNotification };
