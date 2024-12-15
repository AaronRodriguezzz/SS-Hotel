import './RoomConfirmationStyle.css';
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';
import FloatingButton from '../Components/ChatBot';

const RoomConfirmation = () => {
    const storageRoom = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const [rooms, setRooms] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        if(storageRoom){
            setRooms(storageRoom);  
        }
    },[])

    const handleFinishedClicked = async (e) => {
        e.preventDefault();

        const clientData = {
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber
        }
        if(clientData){
            navigate('/email_verification', {state: {clientData, rooms}})                   
        }
    }

    return(
        <>
        <Navbar/>
        <FloatingButton/>

        <div className="main-page">
            <form onSubmit={handleFinishedClicked}>
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
                        minLength={11}
                        maxLength={11}
                        required
                    />  
                </div>
                
                <h2>Selected Room/s</h2>

                {rooms && rooms.map((room,index) => {
                    return(
                        <div className="reserved-rooms" key={room._id}>
                            <div className="roomType-roomPrice" style={{display:"flex", flexDirection:"row"}}>
                                <h4>{room.roomType}</h4>
                                <h6>₱{room.price * room.daysGap}.00 for {room.daysGap} nights </h6>
                            </div>
                            
                            <p>Duration: {room.checkInDate} - {room.checkOutDate}</p>
                            <p>{room.maximumGuest} maximum guest</p>

                        </div>
                    )
                })}
                <div className=''>

                </div>
                
                <div className="reservation-buttons">

                    <Link to='/'>
                        <button type='button' className='cancel'>CANCEL</button>
                    </Link>

                    <Link to='/booknow'>
                        <button type='button' id='add-rooms'>ADD ROOMS</button>
                    </Link>

                    <button className='finish'>FINISH</button>
                </div>
            </form>
        </div>

        <Footer/>
    </>
    )
    
}

export default RoomConfirmation;