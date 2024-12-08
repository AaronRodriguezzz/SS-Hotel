import { useState, useEffect} from 'react';
import './ProcessWalkin.css';

const ProcessWalkIn = () => {

    const today = new Date().toISOString().split('T')[0];
    const [checkInDate, setCheckInDate] = useState([]);
    const [checkOutDate, setCheckOutDate] = useState([]);
    const [minCheckOut, setMinCheckOut] = useState('');

    const [numberOfRooms, setNumberOfRooms] = useState(2);
    const [rooms, setRooms] = useState([]);
    const [roomNum, setRoomNum] = useState([]);


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // value of select elemet 
    const [selectedRoomType, setSelectedRoomType] = useState([]);
    const [selectRoomNum, setSelectedRoomNum] = useState([]);
    const [selectedGuestCount, setSelectedGuestCount] = useState([]);

    const proceed_payment = () => {

    }

    const add_div = (num) => {
        setNumberOfRooms(numberOfRooms + num);
    }

    const handleChangeRoom = async (room,index) => {

        setSelectedRoomType(prev => {
            const updatedRoom = [...selectedRoomType];
            updatedRoom[index] = room.roomType
            return updatedRoom;
        })

        try{
            const dataToSend = { checkInDate, checkOutDate };
            const response = await fetch('http://localhost:4001/api/availabilitySearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if(response.ok){
                const data = await response.json();
                
            }

        }catch(err){
            console.log('fetch available walkin' , err);
        }
    } 
    
    const handleChange_CheckIn = () => {
        
    }


    useEffect(() => {
        const initializeArray = () => {
            const newArray = Array.from({ length: numberOfRooms }, (_, i) => i);
            setSelectedRoomType(newArray);
            setSelectedGuestCount(newArray);
            setCheckInDate(newArray);
            setCheckOutDate(newArray);
            setSelectedRoomNum(newArray);
        };
    
        initializeArray();
    }, [numberOfRooms]);
    

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

    useEffect(() => {
        const fetchRoomNums = async () => {    
            try{
                const response = await fetch('http://localhost:4001/roomnum/available');
                const data = await response.json();
                
                if(response.ok){
                    setRoomNum(data.roomNum);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchRoomNums()
    },[]);

    return(
        <div className="process-walkIn-page">
            <div className="room-container">

                {rooms.length > 0 && Array.from({ length: numberOfRooms }, (_, i) => {
                        
                    return (
                        <div className='room-div' key={i}>
                            <div className="date-container">
                                <div className="date-each-container">
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
                                
                                <div className="date-each-container">
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
                            
                            <div className="room-input-info">
                                <div className="room-input-info-each">
                                    <label htmlFor="room-type">Room Type</label>
                                    <select name="room-type" id="room-type" onChange={(e) => handleChangeRoom(JSON.parse(e.target.value), i)}>
                                        <option value={''} selected disabled>Select Room Type</option>
                                        {rooms && rooms.map(room => 
                                            <option value={JSON.stringify(room)}>{room.roomType}</option>
                                        )}
                                    </select>
                                </div>
                                

                                <div className="room-input-info-each">
                                    <label htmlFor="room-type">Room Type</label>
                                    <select name="room-type" id="room-type" onChange={(e) => handleChangeRoom(e.target.value, i)}>
                                        <option value={''} selected disabled>Select Room Number</option>
                                        {roomNum && roomNum.filter(room => room.roomType === selectedRoomType[i]).map(room => (
                                            <option key={room.roomNumber} value={room.roomNumber}>
                                                {room.roomNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            

                            <label htmlFor="guest-quantity">Room {i + 1} Guest Count</label>
                            <select name="guest-quantity" id="room-type">
                                {rooms && rooms.map(room => 
                                    <option value={room.roomLimit}>{room.roomLimit}</option>
                                )}
                            </select>
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