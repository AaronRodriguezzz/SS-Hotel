import './RoomConfirmationStyle.css';
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';


const RoomConfirmation = () => {
    const location = useLocation();
    const { selectedRooms = [] ,bookedRoom = [], daysGap,checkInDate,checkOutDate } = location.state || {};
    const rooms = bookedRoom || selectedRooms || [];
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [guestNumber, setGuestNumber] = useState(rooms.map(room => room.maximumGuest));
    const [roomCount, setRoomCount] = useState(rooms.map(() => 1));


    const handleFinishedClicked = async () => {
        try{

            const dataToSend = {
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                selectedRooms: rooms,
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                daysGap: daysGap,
                roomCount: roomCount,
                guestNumber: guestNumber
            }

            console.log(dataToSend);

            const response = await fetch('http://localhost:4001/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const data = await response.json();
            } else {
                console.log('Failed to fetch room availability');
            }

        }catch(err){
            console.log('Error Nye: ' , err );
        }
    }

    const handleGuestNumber = (index, value) => {
        setGuestNumber(prevState => {

            const guestCount = [...prevState];
            guestCount[index] = value;
            return guestCount;

        })
    }

    const handleRoomCount = (index, value) => {
        setRoomCount(prevState => {

            const roomCount = [...prevState];
            roomCount[index] = value;
            return roomCount;

        })
    }

    if (!rooms) {
        return <Navigate to="/booknow" />;
    }




    return(
        <>
        <Navbar/>
        <div className="main-page">
            <form className="container">
                <h1>Booking Confirmation</h1>
                <div className="reservation-info">

                    <label htmlFor="full-name">Full Name</label>
                    <input 
                        type="text" 
                        name='full-name'
                        title="Only letters are allowed"
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input  
                        type="email" 
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />  

                    <label htmlFor="phone">Phone Number</label>
                    <input  
                        type="text" 
                        name='phone'
                        pattern="\d*" 
                        title="Only numbers are allowed"                        
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                        min={11}
                        max={11}
                        required
                    />  
                </div>
                
                <h2>Selected Room/s</h2>

                
                {rooms && rooms.map((room,index) => {
                    return(
                        <div className="reserved-rooms" key={room._id}>
                            <h4>{room.roomType}</h4>
                            <h6>₱ {((room.price * daysGap) * roomCount[index]) + ((guestNumber[index] - room.maximumGuest) * 1200)}</h6>

                            <div className='guest-div'>
                                <input  
                                    type="number" 
                                    name='guest-number'
                                    placeholder= {room.maximumGuest}
                                    value={guestNumber[index]}
                                    onChange={(e) => handleGuestNumber(index, e.target.value)}
                                    min={room.maximumGuest}
                                    max={10}
                                    required
                                />
                                <div className="guestSec-text">
                                    <label htmlFor="guest-number">GUESTS</label>
                                    <p>₱ 1200 on every guest added</p>
                                </div>
                            </div>
                            

                            <div className='room-quantity'>
                                <input  
                                    type="number" 
                                    name='room-to-available'
                                    placeholder='1'
                                    onChange={(e) => handleRoomCount(index, e.target.value)}
                                    value={roomCount[index]}
                                    min={1}
                                    max={room.roomLimit}  //change this base on the limit of the room
                                    required
                                />
                                <label htmlFor="room-to-available">x Rooms</label>
                            </div>
                        </div>
                    )
                    
                })}

                
                <div className="reservation-buttons">
                    <Link onClick={handleFinishedClicked} to='/'>
                        <button type='cancel' className='cancel'>CANCEL</button>
                    </Link>

                    <Link  onClick={handleFinishedClicked}  to='/' >
                        <button type='submit' className='finish'>FINISH</button>
                    </Link>

                </div>
            </form>
        </div>

        <Footer/>
    </>
    )
    
}

export default RoomConfirmation;