import { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ChatProvider } from '../Components/ChatContext';
import './BookNowStyle.css'
import Navbar from '../Components/NavBar'
import FloatingButton from '../Components/ChatBot';
import Loading from '../Components/LoadindDiv';
import Calendar from '../Components/Calendar';

const BookNowPage = () => {
    const storageRoom = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [minCheckOut, setMinCheckOut] = useState('');
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [roomSchedule, setRoomSchedule] = useState([]);
    const [bookedRoom,setBookedRoom]= useState([]);
    const [daysGap , setDaysGap] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalPayment, setTotalPayment] = useState(0);
    const [roomToCalendar, setRoomToCalendar] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();


    const handleAddRoom = (room) => {
        const addedRoom = JSON.parse(room); 
        addedRoom.daysGap = daysGap;
        addedRoom.checkInDate = checkInDate;  
        addedRoom.checkOutDate = checkOutDate; 
        
        console.log(addedRoom); 
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
                    const dataToSend = { checkInDate, checkOutDate };

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
                        setRoomSchedule(data.schedule);
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
    
    useEffect(() => {
        console.log(roomsAvailable);
    },[roomsAvailable])

    return(
        <>
        
        <Navbar/>
        <FloatingButton/>
            <div className='bookNow-search-section'>
                <div className='form-group'>
                    <label htmlFor="checkIn">Check-In Date</label>
                    <input 
                        type='date' 
                        name='checkIn'
                        value={checkInDate} 
                        min={today}
                        required 
                        onChange={(e) => {
                            setCheckInDate(e.target.value)
                            const checkIn = new Date(e.target.value);
                            checkIn.setDate(checkIn.getDate() + 1);
                            setMinCheckOut(checkIn.toISOString().split('T')[0]);     
                            setCheckOutDate('');               
                        }}
                    
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="checkOut">Check-Out Date</label>
                    <input 
                        type='date' 
                        name='checkOut'
                        value={checkOutDate} 
                        onChange={(e) => setCheckOutDate(e.target.value)}  
                        min={minCheckOut}
                        required 
                    />
                </div>
            </div>
            
            <div className="calendar-div" style={{display: checkInDate !== '' && checkOutDate !== '' ? "flex":"none" }}>
                <Calendar roomType={roomToCalendar}/>
            </div>

            <div className='avail-rooms'>
                <div className="room-choice">
                    {loading ? (
                        <Loading/>
                    ) : (
                        roomsAvailable.length === 0 ? (
                            <h1 className='message' style={{display: checkInDate !== '' && checkOutDate !== '' ? 'block':'none'}}>No Rooms Available on that date</h1>
                        ): (
                          checkInDate !== '' && checkOutDate !== '' && roomsAvailable.map(room => (
                                <div key={room._id} className='room'>
                                    <img src={`/photos/z${room.roomType}.jpg`} alt={`${room.roomType}`} />  
                                    <div className='room-text'>
                                        <h1>{room.roomType}</h1>
                                        <h4>₱ {room.price * daysGap} / {daysGap} days | ₱ {room.price} / day</h4>
                                        <h4>MAXIMUM OF {room.maximumGuest} GUESTS</h4>
                                        <h4>{room.roomLimit} rooms available for your choosen date</h4>
                                        <p>{room.roomDescription}</p>

                                        <div className="room-button-container">
                                            <button  className='link-button' onClick={() => handleAddRoom(JSON.stringify(room))}>ADD ROOM</button>
                                            <button  className='calendar-button' onClick={() => handleCalendar(room.roomType)}><img src="./photos/calendar.png" alt="calendar" /></button>
                                        </div>
                                    
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
                

                <div className="summary-container" style={{display: checkInDate !== '' && checkOutDate !== '' && roomsAvailable ? 'block':'none'}}>
                    <h4>Your Cart: {bookedRoom.length} items</h4>

                    {bookedRoom.length > 0 && bookedRoom.map((room,index) => {
                        return(
                            <div className="added-summary-rooms">
                                <div className="roomtype-price-container">
                                    <h6>{room.roomType}</h6>
                                    <h4>₱{room.price * room.daysGap}.00</h4>
                                </div>
                                <p>{room.daysGap} Nights Stay</p>


                                <div className="bottom-text-container">
                                    <h5>{room.checkInDate} - {room.checkOutDate}</h5>
                                    <p>Including taxes and fees</p>
                                </div>
                                
                                <button onClick={() => handleRemoveRoom(index,room.price * room.daysGap)}>Remove</button>
                            </div>
                        )
                     })}
                    
                    <h4>Total ₱{totalPayment}.00</h4>    
                    <button className='checkOut-rooms' onClick={handleCheckout}>CHECK OUT</button>

                </div>  
            </div>



            
        </>
    )
}

export default BookNowPage;