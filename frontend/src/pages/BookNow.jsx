import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookNowStyle.css'
import Navbar from '../Components/NavBar'
import FloatingButton from '../Components/ChatBot';
import Loading from '../Components/LoadindDiv';
import Calendar from '../Components/Calendar';
import formatPrice from '../utils/formatPrice';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { formatDate } from '../utils/dateUtils';

const BookNowPage = () => {
    const storageRoom = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [bookedRoom,setBookedRoom]= useState([]);
    const [daysGap , setDaysGap] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalPayment, setTotalPayment] = useState(0);
    const [roomToCalendar, setRoomToCalendar] = useState('');
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false);
    const today = new Date();


    const handleAddRoom = (room) => {
        const addedRoom = JSON.parse(room); 
        addedRoom.daysGap = daysGap;
        addedRoom.checkInDate = checkInDate;  
        addedRoom.checkOutDate = checkOutDate; 
        setTotalPayment(totalPayment + (addedRoom.price * addedRoom.daysGap));
        setBookedRoom(prev => {
            return [...prev, addedRoom];
        });
    };
 
    const handleRemoveRoom = (index, amountToDeduct) => {
        const updatedRooms = bookedRoom.filter((room, idx) => idx !== index);
        setTotalPayment(totalPayment - amountToDeduct);
        setBookedRoom(updatedRooms);
    }

    const handleCheckout = () => {
        if(bookedRoom.length > 0){
            sessionStorage.setItem("cart", JSON.stringify(bookedRoom));
            navigate('/booking/confirmation', {
                state: bookedRoom ,
            });
        }
    }


    const handleCalendar = (roomType) => setRoomToCalendar(roomType)

    useEffect(() => {
        if(storageRoom.length > 0){
            const initializeRoom = () => {
                setBookedRoom(storageRoom || []);
                setCheckInDate(storageRoom[0].checkInDate);
                setCheckOutDate(storageRoom[0].checkOutDate);
    
                let tempTotal = 0;
                storageRoom.map(room => {
                    return (tempTotal += (room.price * room.daysGap))
                })
    
                setTotalPayment(tempTotal);
            }

            initializeRoom();
        }

    },[])

    useEffect(() => {
        const fetchRooms = async () => {
            if (checkInDate && checkOutDate) {
                setLoading(true);
                try {
                    const dataToSend = { checkInDate: new Date(checkInDate), checkOutDate: new Date(checkOutDate) };

                    const response = await fetch('/api/availabilitySearch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setRoomsAvailable(data.roomAvailable);
                        setDaysGap(data.gap);
                    } else {
                        console.error('Failed to fetch room availability');
                    }

                } catch (err) {
                    console.error('Error fetching rooms:', err);
                }finally{
                    setLoading(false);
                }
            }
        };

        fetchRooms();
    }, [checkInDate, checkOutDate]);
    

    return(
        <div className='bookNow-page'>
        <Navbar/>
        <FloatingButton/>

            <div className='bookNow-search-section'>
                <div className='form-group'>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker']} >
                    <DatePicker
                        label="Check In Date"
                        disablePast
                        onChange={(e) => {
                            if(new Date(formatDate(new Date(e.$d))) >= new Date(checkOutDate)){
                                setCheckOutDate()
                            }
                            setCheckInDate(formatDate(new Date(e.$d)))
                        }}
                        value={!checkInDate ? null : dayjs(checkInDate)}
                        minDate={today.getHours() < 12 
                            ? dayjs(new Date(new Date().toLocaleDateString('en-US')))
                            : dayjs(new Date().setDate(new Date().getDate() + 1))}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker']} >
                    <DatePicker
                        label="Check Out Date"
                        disablePast
                        onChange={(e) => setCheckOutDate(formatDate(new Date(e.$d)))}
                        value={!checkOutDate ? null : dayjs(checkOutDate)}
                        minDate={!checkInDate ? null : dayjs(new Date(new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 1)))}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                </div>
            </div>
            
            <div className="calendar-div" style={{display: checkInDate !== '' && checkOutDate !== '' ? "flex":"none" }}>
                {showCalendar && <Calendar roomType={roomToCalendar} close={() => setShowCalendar(false)}/>}
            </div>

            <div className='avail-rooms'>
            {loading ? (
                        <Loading/>
            ) : (
                <div className="room-choice">
                        {roomsAvailable.length === 0 && checkInDate && checkOutDate ? (
                            <h1 className='message' style={{display: checkInDate !== '' && checkOutDate !== '' ? 'block':'none'}}>No Rooms Available on that date</h1>
                        ): (
                          checkInDate && checkOutDate && roomsAvailable.map(room => {
                            return(
                                <div key={room._id} className='room'>
                                    <img src={`/photos/z${room.roomType}.jpg`} alt={`${room.roomType}`} />  
                                    <div className='room-text'>
                                        <h1>{room.roomType}</h1>
                                        <h4>{formatPrice(room.price * daysGap)} / {daysGap} days | {formatPrice(room.price)} / day</h4>
                                        <h4>MAXIMUM OF {room.maximumGuest} GUESTS</h4>
                                        <h4>{room.roomLimit} rooms available for your choosen date</h4>
                                        <p>{room.roomDescription}</p>

                                        <div className="room-button-container">
                                            <button  className='link-button' 
                                                onClick={() => handleAddRoom(JSON.stringify(room))}
                                                disabled={bookedRoom.filter(item => item.roomType === room.roomType).length === room.roomLimit}
                                            >ADD ROOM</button>
                                            <button  className='calendar-button' 
                                            onClick={() => {
                                                handleCalendar(room.roomType);
                                                setShowCalendar(true)
                                            }}><img src="./photos/calendar.png" alt="calendar" /></button>
                                        </div>
                                    
                                    </div>
                                </div>
                            )})
                        )}
                   
                </div>
            )}

                {!loading && <div className={`cart-container ${!showCart ? 'hide' : ''}`}>
                    <h3>Your Cart: {bookedRoom.length} items</h3>
                    <div className='items-container'>
                    {bookedRoom.length > 0 && bookedRoom.map((room,index) => {
                        return(
                            <div className="added-summary-rooms">
                                <div className="roomtype-price-container">
                                    <h3>{room.roomType}</h3>
                                    <h3>{formatPrice(room.price * room.daysGap)}</h3>
                                </div>
                                <p>{room.daysGap} Nights Stay</p>


                                <div className="bottom-text-container">
                                    <h4>{room.checkInDate} - {room.checkOutDate}</h4>
                                    <p>Including taxes and fees</p>
                                </div>
                                
                                <button onClick={() => handleRemoveRoom(index,room.price * room.daysGap)}>Remove</button>
                            </div>
                        )
                     })}
                    </div>
                    <div>
                        <h3 style={{fontSize: '20px'}}>Total: {formatPrice(totalPayment)}</h3>    
                        <button className='checkOut-rooms' onClick={handleCheckout}>CHECK OUT</button>
                    </div>
                </div> } 
            </div>
            <button className='cart-btn' onClick={() => setShowCart(prev => !prev)}>
                {bookedRoom.length > 0 && <span>{bookedRoom.length}</span>}
                <img src="/photos/cart.png" alt="" />
            </button>
        </div>
    )
}

export default BookNowPage;