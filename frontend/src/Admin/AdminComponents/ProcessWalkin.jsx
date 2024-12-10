import { useState, useEffect} from 'react';
import './ProcessWalkin.css';
import { formatDate } from '../../utils/dateUtils';

const ProcessWalkIn = () => {
    const [numberOfRooms, setNumberOfRooms] = useState(2);
    const [rooms, setRooms] = useState([]);
    const [roomNum, setRoomNum] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // value of select elemet 

    const [selectedRooms, setSelectedRooms] = useState([]);

    const proceed_payment = () => {

    }

    const add_div = (num) => {
        setNumberOfRooms(numberOfRooms + num);
    }

    const handleSearch = async (index) => {
        try{
            const { checkInDate, checkOutDate } = selectedRooms[index];
            if(checkInDate < checkOutDate){
                const response = await fetch('/api/availabilitySearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ checkInDate, checkOutDate }),
                });
    
                if(response.ok){
                    const data = await response.json();
                    return data.roomAvailable
                }
            }

        }catch(err){
            console.log('fetch available walkin' , err);
        }
    }
    

    const handleChangeDetails = async (index, value, type) => {
        setSelectedRooms(await Promise.all(selectedRooms.map(async (room, i) => {
            if(index === i){
                if(type === 'checkInDate' || type === 'checkOutDate'){
                    room.roomType = '';
                    room.roomNum = '';
                }
                room[type] = value;
                room.availableRooms = await handleSearch(index);

                return room
            }else{
                return room
            }
        })));
    }

    useEffect(() => {
        const initializeSelectedRooms = () => {
            setSelectedRooms( Array.from({ length: numberOfRooms }, (_, i) => ({
                roomType: selectedRooms[i]?.roomType || '',
                roomNum: selectedRooms[i]?.roomNum || '',
                guestCount: selectedRooms[i]?.guestCount || '',
                checkInDate: selectedRooms[i]?.checkInDate || '',
                checkOutDate: selectedRooms[i]?.checkOutDate || '',
                minCheckOut: selectedRooms[i]?.minCheckOut || '',
                availableRooms: selectedRooms[i]?.availableRooms || [],
            })))
        };
        initializeSelectedRooms();
    }, [numberOfRooms]);
    
    useEffect(() => {
        const fetchRooms = async () => {    
            try{
                const response = await fetch('/api/roomdata');
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
                const response = await fetch('/api/roomnum/available');
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
                            <h2>Room #{i + 1}</h2>
                            <div className="date-container">
                                <div className="date-each-container">
                                    <label htmlFor="checkIn">Check-In Date</label>
                                    <input 
                                        type='date' 
                                        name='checkIn'
                                        value={selectedRooms[i]?.checkInDate} 
                                        min={formatDate(new Date())}
                                        required 
                                        onChange={(e) => handleChangeDetails(i, e.target.value, 'checkInDate')}
                                    />
                                </div>
                                
                                <div className="date-each-container">
                                    <label htmlFor="checkOut">Check-Out Date</label>
                                    <input 
                                        type="date"
                                        name="checkOut"
                                        value={selectedRooms[i]?.checkOutDate} 
                                        onChange={(e) => handleChangeDetails(i, e.target.value, 'checkOutDate')}  
                                        min={(() => {
                                            const checkInDate = selectedRooms[i]?.checkInDate;
                                            if (checkInDate) {
                                            // Add 1 day to checkInDate
                                            const minDate = new Date(checkInDate);
                                            minDate.setDate(minDate.getDate() + 1); // Set to the next day
                                            return minDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD
                                            }
                                            // If no checkInDate, set today's date as minimum
                                            return formatDate(new Date()); // Today's date in YYYY-MM-DD
                                        })()}
                                        required 
                                        />

                                </div>
                                
                            </div>
                            
                            <div className="room-input-info">
                                <div className="room-input-info-each">
                                    <label htmlFor="room-type">Room Type</label>
                                    <select name="room-type" id="room-type" value={selectedRooms[i]?.roomType} onChange={(e) => handleChangeDetails(i, e.target.value, 'roomType')}>
                                        <option value={''} disabled>Select Room Type</option>
                                        {selectedRooms[i]?.availableRooms && selectedRooms[i]?.availableRooms.map(room => 
                                            <option value={room.roomType}>{room.roomType}</option>
                                        )}
                                    </select>
                                </div>
                                

                                <div className="room-input-info-each">
                                    <label htmlFor="room-type">Room Type</label>
                                    <select name="room-type" id="room-type" value={selectedRooms[i]?.roomNum} onChange={(e) => handleChangeDetails(i,  e.target.value, 'roomNum')}>
                                        <option value={''} disabled>Select Room Number</option>
                                        {roomNum && roomNum.filter(room => room.roomType === selectedRooms[i]?.roomType).map(room => (
                                            <option key={room.roomNumber} value={room.roomNumber}>
                                                {room.roomNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            

                            <label htmlFor="guest-quantity">Room {i + 1} Guest Count</label>
                            <select name="guest-quantity" id="room-type" value={selectedRooms[i]?.guestCount} onChange={(e) => handleChangeDetails(i, e.target.value, 'guestCount')}>
                                {rooms && [...new Set(rooms.map(room => room.roomLimit))].sort((curr, next) => curr - next).map(roomLimit => 
                                        <option value={roomLimit}>{roomLimit}</option>
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