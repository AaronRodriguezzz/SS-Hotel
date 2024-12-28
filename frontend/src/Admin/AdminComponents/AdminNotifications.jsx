import { useState, useEffect } from 'react';
import './AdminNotifications.css';
import io from 'socket.io-client';
import { formatDateTime } from '../../utils/dateUtils';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4001';

const AdminNotifications = ({handleSectionChange}) => {
    const [limit, setLimit] = useState(10);
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);
    const [socket, setSocket] = useState();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const socket = io(URL,{
            withCredentials: true,
        });
        
        socket.emit('notifications', limit)
        socket.on('notifications', (notifications) => {
            setNotifications(notifications.notifications)
            setTotal(notifications.total)
        })
        
        socket.on('notification', (notification) => {
            setNotifications(prev => [notification, ...prev])
        })

        setSocket(socket);

    }, []);

    useEffect(() => {
        if(socket){
            socket.emit('notifications', limit);
        }
    }, [limit])

    return (
        <div className='notifications'>
            <button onClick={() => {
                if(show) socket.emit('notifications', limit)
                setShow(!show);
                socket.emit('read');
            }}>
                <img src="/photos/notification.png" alt="" />
            </button>
            {notifications.filter(notification => notification.status === 'Unread').length > 0 && <span>{notifications.filter(notification => notification.status === 'Unread').length}</span>}
            {show && <div className='notifications-dropdown'>
                <h1>Notifications</h1>
                <div className='notifications-container'>
                {notifications.length > 0 && notifications.map(notification => 
                    <div className={`notification ${notification.status === 'Unread' ? 'unread' : ''}`}
                        onClick={() => handleSectionChange('reservations')}
                    >
                        <img src="/photos/notification.png" alt="" />
                        <div>
                        <p>{notification.message}</p>    
                        <p>{formatDateTime(new Date(notification.createdAt))}</p>      
                        </div>              
                    </div>
                )
                }
                </div>
                {limit < total && <button onClick={() => setLimit(prev => prev + 10)}>Show More</button>}
            </div>}

        </div>
    )
}

export default AdminNotifications