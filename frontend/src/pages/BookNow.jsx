import { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './BookNowStyle.css'
import Navbar from '../Components/NavBar'

const BookNowPage = () => {

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [budget, setBudget] = useState(0);
    const [minCheckOut, setMinCheckOut] = useState('');
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [checkedRooms, setCheckedRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [bookedRoom,setBookedRoom]= useState([]);
    const [multipleSelected, setMultiple] = useState(0);
    const [daysGap , setDaysGap] = useState(0);
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();


    const handleCheckboxChange = (roomId) => { 
        setCheckedRooms((prevSelectedRooms) => {
            
                if (prevSelectedRooms.includes(roomId)) {
                    // Remove room from selected rooms if it was already selected
                    return prevSelectedRooms.filter(id => id !== roomId);
                } else {
                    // Add room to selected rooms
                    return [...prevSelectedRooms, roomId];
                }
        }); 
    };

    const handleBookAll = () => {
        const filteredRooms = roomsAvailable.filter((room) => checkedRooms.includes(room._id));
        setSelectedRooms(filteredRooms);   
    }


    const handleBookNowClick = (roomId) => {
        setSelectedRooms([]);   

        const filterSingleRoom = roomsAvailable.filter((room) => room._id === roomId);
        setBookedRoom(filterSingleRoom);
    };

    const handleSelectMultiple = () => {

        if(multipleSelected === 0){
            setMultiple(1);
        }else{
            setMultiple(0);
        }
    }

    const handleSearch = async () => {
        try{

            const dataToSend = {
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                budget: budget
            }   

            const response = await fetch('http://localhost:4001/api/availabilitySearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                const data = await response.json();
                setRoomsAvailable(data.roomAvailable || []); 
                setDaysGap(data.gap);
            } else {
                console.log('Failed to fetch room availability');
            }

        }catch(err){
            console.log('Error Nye: ' , err );
        }
    }

    useEffect(() => {
        if (selectedRooms.length > 0 || bookedRoom.length > 0) {
            // Delay navigation until selectedRooms is not empty
            navigate('/booking/confirmation', {
                state: { selectedRooms,bookedRoom, daysGap,checkInDate,checkOutDate },
            });
        }

    }, [selectedRooms,bookedRoom, navigate, daysGap]);

    useEffect(() => {
        if(checkInDate != '' && checkOutDate != ''){
            handleSearch();
        }
    },[checkInDate,checkOutDate, budget]);
   

    return(
        <>
        <Navbar/>
            <form className='search-section'>
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

                <div className='form-group'>
                    <label htmlFor="checkOut">Cost Range</label>
                    <input 
                        type='number' 
                        name='budget'
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)} 
                        min={3189}
                        required
                    />
                </div>

                <button type='button' onClick={handleSearch} disabled={checkInDate && checkOutDate ? false : true}>Search</button>
            </form>


            <div className='avail-rooms'>
                <button onClick={handleSelectMultiple} className='seleect-all'  style={{display: checkInDate !== '' && checkOutDate !== '' && budget !== 0 ? 'block':'none'}}>Select Multiple Rooms</button>
                {roomsAvailable.length === 0 ? (
                    <h1 className='message' style={{display: checkInDate !== '' && checkOutDate !== '' && budget !== 0 ? 'block':'none'}}>No Rooms Available on that date</h1>
                    ) : (
                        roomsAvailable.map(room => (
                            <div key={room._id} className='room'>
                                <input type='checkbox' 
                                       style={{ display: multipleSelected === 1 ? 'flex' : 'none' }} 
                                       checked={checkedRooms.includes(room._id)} 
                                       onChange={() => handleCheckboxChange(room._id)}

                                />
                                <img src={`/photos/z${room.roomType}.jpg`} alt={`${room.roomType}`} />  
                                <div className='room-text'>
                                    <h1>{room.roomType}</h1>
                                    <h4>₱ {room.price * daysGap}  | ₱ {room.price} / day</h4>
                                    <h4>{room.maximumGuest} GUESTS</h4>
                                    <p>{room.roomDescription}</p>

                                    <Link onClick={() => handleBookNowClick(room._id)} >
                                        <button  className='link-button'>BOOK NOW</button>
                                    </Link>

                                </div>
                            </div>
                        ))
                    )}
                <Link onClick={handleBookAll} >
                    {checkedRooms.length > 0 && (
                        <button className="link-button" >
                            Book All Selected Rooms
                        </button>   
                    )}                
                </Link>

            </div>
        </>
    )
}

export default BookNowPage;