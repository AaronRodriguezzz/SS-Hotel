import { useState, useEffect} from 'react';
import './ProcessWalkin.css';

const ProcessWalkIn = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState(3);
    const [rooms, setRooms] = useState([]);
    const [guestCount, setGuestCount] = useState([]);

    const proceed_payment = () => {

    }

    const add_div = (num) => {
        setNumberOfRooms(numberOfRooms + num);
    }

    useEffect(() => {
        const fetchRooms = async () => {    
            try{
                const response = await fetch('http://localhost:4001/roomdata');
                const data = await response.json();

                if(response.ok){
                    setRooms(data.rooms);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchRooms()
    },[]);

    return(
        <div className="process-walkIn-page">
            <div className="room-container">

                {rooms && Array.from({ length: numberOfRooms }, (_, i) => {
                    return (
                        <div className='room-div' key={i}>
                            <label htmlFor="room-type">Room Type</label>
                            <select name="room-type" id="room-type">
                                {rooms && rooms.map(room => {
                                    <option value={room.roomType}>{room.roomType}</option>
                                })}
                            </select>

                            <label htmlFor="room-quantity">Room Quantity</label>
                            <select name="room-quantity" id="room-quantity" onChange={(e) => setGuestCount[i](e.target.value)}>
                                {rooms && rooms.map(room => {
                                    <option value={room.roomLimit}>{room.roomLimit}</option>
                                })}
                            </select>


                            {guestCount.length > 0 && Array.from({ length: guestCount[i] }, (_, i) => {
                                 return (
                                    <div>
                                        <label htmlFor="guest-quantity">Room {i} Guest Count</label>
                                        <select name="guest-quantity" id="room-type">
                                            {rooms && rooms.map(room => {
                                                <option value={room.roomLimit}>{room.roomLimit}</option>
                                            })}
                                        </select>
                                    </div>
                                 )
                            })}       

                        </div>      
                    )
                })}                

                <div className='container-buttons'>
                    <button onClick={() => add_div(1)}><span>+</span> ADD ROOM TYPE</button>
                    <button onClick={() => add_div(-1)} disabled={numberOfRooms === 1}>—</button>
                </div>
            </div>

            <div className="client-info-container">

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

                <button>PROCEED PAYMENT</button>
            </div>
        </div>
    )
}

export default ProcessWalkIn;