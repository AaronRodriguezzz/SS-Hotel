import { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './BookNowStyle.css'
import Navbar from '../Components/NavBar'

const BookNowPage = () => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [minCheckOut, setMinCheckOut] = useState('');
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [bookedRoom,setBookedRoom]= useState([]);
    const [multipleSelected, setMultiple] = useState(0);
    const [daysGap , setDaysGap] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();


    const handleAddRoom = (room) => {
        const addedRoom = JSON.parse(room); 
        addedRoom.daysGap = daysGap;
        addedRoom.checkInDate = checkInDate;  
        addedRoom.checkOutDate = checkOutDate; 

        setTotalPayment(totalPayment + (addedRoom.price * addedRoom.daysGap));
        setBookedRoom(prev => {
            return [...prev, addedRoom];
        });

        console.log(bookedRoom);

    };

    const handleRemoveRoom = (index) => {
        const updatedRooms = bookedRoom.filter((room, idx) => idx !== index);
        console.log(updatedRooms);
        setBookedRoom(updatedRooms);
    }


    useEffect(() => {
        const handleTotalChange = () => {
            const total = bookedRoom.map((room) => {
                let totalPayment = 0; 
                return totalPayment += room.price * room.daysGap;

            })

            console.log(total);
            setTotalPayment(totalPayment )
        }
    },[bookedRoom])

   /* useEffect(() => {
        if (selectedRooms.length > 0 || bookedRoom.length > 0) {
            // Delay navigation until selectedRooms is not empty
            navigate('/booking/confirmation', {
                state: { selectedRooms,bookedRoom, daysGap,checkInDate,checkOutDate },
            });
        }

    }, [selectedRooms,bookedRoom, navigate, daysGap]);*/

    useEffect(() => {
        const fetchRooms = async () => {
            if (checkInDate && checkOutDate) {
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
                        setDaysGap(data.gap);
                    } else {
                        console.error('Failed to fetch room availability');
                    }
                } catch (err) {
                    console.error('Error fetching rooms:', err);
                }
            }
        };

        fetchRooms();
    }, [checkInDate, checkOutDate]);

    return(
        <>
        <Navbar/>
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
            

            <div className='avail-rooms'>
                <div className="room-choice">
                    {roomsAvailable.length === 0 ? (
                        <h1 className='message' style={{display: checkInDate !== '' && checkOutDate !== '' ? 'block':'none'}}>No Rooms Available on that date</h1>
                    ) : (
                            roomsAvailable.map(room => (
                                <div key={room._id} className='room'>
                                    <img src={`/photos/z${room.roomType}.jpg`} alt={`${room.roomType}`} />  
                                    <div className='room-text'>
                                        <h1>{room.roomType}</h1>
                                        <h4>₱ {room.price * daysGap} / {daysGap} days | ₱ {room.price} / day</h4>
                                        <h4>MAXIMUM OF {room.maximumGuest} GUESTS</h4>
                                        <p>{room.roomDescription}</p>

                                        <div className="room-button-container">
                                            <button  className='link-button' onClick={() => handleAddRoom(JSON.stringify(room))}>ADD ROOM</button>
                                            <button  className='calendar-button'><img src="./photos/calendar.png" alt="calendar" /></button>
                                        </div>
                                    
                                    </div>
                                </div>
                            ))  
                    )}
                </div>
                

                <div className="summary-container" style={{display: checkInDate !== '' && checkOutDate !== '' ? 'block':'none'}}>
                     <h4>Your Cart: {bookedRoom.length} items</h4>

                     {bookedRoom.length > 0 && bookedRoom.map((room,index) => {
                        return(
                            <div className="added-summary-rooms">
                                <div className="roomtype-price-container">
                                    <h6>{room.roomType}</h6>
                                    <h4>₱{room.price}.00</h4>
                                </div>
                                <p>{daysGap} Nights Stay</p>


                                <div className="bottom-text-container">
                                    <h5>{room.checkInDate} - {room.checkOutDate}</h5>
                                    <p>Including taxes and fees</p>
                                </div>
                                
                                <button onClick={() => handleRemoveRoom(index)}>Remove</button>
                            </div>
                        )
                     })}

                    
                    <h4>Total ₱{totalPayment}.00</h4>    
                    <button className='checkOut-rooms'>CHECK OUT</button>

                </div>  
            </div>



            
        </>
    )
}

export default BookNowPage;