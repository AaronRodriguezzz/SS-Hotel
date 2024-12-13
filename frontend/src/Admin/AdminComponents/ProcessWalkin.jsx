import { useState, useEffect} from 'react';
import './ProcessWalkin.css';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import ReservationSummary from './ReservationSummary';
import jsPDF from 'jspdf'

const ProcessWalkIn = () => {
    const [numberOfRooms, setNumberOfRooms] = useState(2);
    const [rooms, setRooms] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showSummary, setShowSummary] = useState();
    
    const reserve = async (e) => {
        e.preventDefault();
        if(confirm('Click ok to continue')){
            try{
                const response = await fetch(`/api/reserve/admin`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ stateData: {fullName, phoneNumber, email}, rooms: selectedRooms }),
                });
                if(response.ok){
                    generateReceipt();
                    window.location.reload();
                }
            }catch(err){    
                console.error('Error: ', err)
            }
        }
    }

    const generateReceipt = () => {
        const initialPageHeight = 200;  
        const doc = new jsPDF({
            unit: 'mm',
            format: [80, initialPageHeight]
        });
    
        doc.setFontSize(15);
        doc.setFontSize(8);
        doc.text('Silver Stone Hotel Receipt', 40, 10, null, null, 'center');
        doc.text('silverstonehotel@gmail.com', 40, 20, null, null, 'center');
        let yPosition = 35;  // Initial yPosition after title
        const margin = 10;
        const lineHeight = 5;  // Space between lines
        const itemWidth = 60;  // Width for price column
    
        // Helper function to track the total content height
        const getContentHeight = () => yPosition + lineHeight;
    
        // Track total height needed
        let totalHeight = getContentHeight();
        doc.setFontSize(5);
        // Add the static content (Date and Booking Reference)
        doc.text(`Book Date: ${formatDateTime(new Date())}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Guest Name: ${fullName}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Guest Email: ${email}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Guest Phone Number: ${phoneNumber}`, margin, yPosition);
        yPosition += lineHeight + 5;
        
        doc.text('Rooms', margin, yPosition);
        doc.text('Price', itemWidth, yPosition);
        yPosition += 5;
    
        // Calculate the total height after adding items
        selectedRooms.forEach(item => {
            // Check if we need to adjust the page height dynamically
            if (getContentHeight() > doc.internal.pageSize.height) {
                // Increase the page height by 20mm
                const newHeight = doc.internal.pageSize.height + 10;  // Increase by 20mm (or more if necessary)
                doc.internal.pageSize.height = newHeight;  // Update internal page height
            }
            
            // Add item to receipt
            doc.text(`${item.roomType} (${formatDate(new Date(item.checkInDate))} to ${formatDate(new Date(item.checkOutDate))})`, margin, yPosition);
            doc.text((item.price * item.gap).toFixed(2), itemWidth, yPosition);  // Format price
            yPosition += lineHeight;
            totalHeight = getContentHeight();  // Update total height
        });
    
        // Draw a horizontal line after the items
        const startX = margin;
        const startY = yPosition;
        const endX = 70;  // Width of receipt
    
        doc.setLineWidth(0.1);  // Set line width
        doc.line(startX, startY, endX, startY);  // Draw the horizontal line
    
        // Add total amount
        const totalAmount = selectedRooms.reduce((total, current) => current.price * current.gap + total, 0);
    
        // Increase page height if needed for total
        if (getContentHeight() > doc.internal.pageSize.height) {
            doc.internal.pageSize.height += 15;  // Add 15mm for total and final line
        }
    
        yPosition += lineHeight;  // Adjust Y position for total
        doc.text('Total: ', margin, yPosition);  // Format total to two decimals
        doc.text(`${totalAmount}`, 60, yPosition);
        yPosition += lineHeight + 5;
        doc.setFontSize(8);
        doc.text('Thank you for choosing Silver Stone Hotel!', 40, yPosition, null, null, 'center');
        // Save the PDF
        doc.save('receipt.pdf');
    };

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
                if(type === 'checkInDate'){
                    room.checkOutDate = '';
                }

                if(type === 'checkInDate' || type === 'checkOutDate'){
                    room.roomType = '';
                    room.roomLimit = '';
                    room.price = '';
                }
                if(type === 'roomType'){
                    room.guestCount = '';
                    room.roomLimit = rooms.find(room => room.roomType === value).roomLimit;
                    room.price = rooms.find(room => room.roomType === value).price;
                }
                const gap = Math.floor((new Date(room.checkOutDate) - new Date(room.checkInDate)) / (1000 * 60 * 60 * 24))
                room.gap = gap;
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
                guestCount: selectedRooms[i]?.guestCount || '',
                checkInDate: selectedRooms[i]?.checkInDate || '',
                checkOutDate: selectedRooms[i]?.checkOutDate || '',
                availableRooms: selectedRooms[i]?.availableRooms || [],
                roomLimit: selectedRooms[i]?.roomLimit || '',
                price: selectedRooms[i]?.price || '',
                gap: selectedRooms[i]?.gap || '',
                
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


    return(
        <div className="process-walkIn-page">
            {showSummary && <ReservationSummary selectedRooms={selectedRooms} submit={reserve} close={() => setShowSummary(false)}/>}
            <div className="room-container">
                {rooms.length > 0 && Array.from({ length: numberOfRooms }, (_, i) => {

                    return (
                        <div className='room-div' key={i}>
                            <h2>ROOM {i + 1}</h2>
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
                            </div>
                            
                                <label htmlFor="guest-quantity">Room {i + 1} Guest Count</label>
                                <select name="guest-quantity" id="room-type" value={selectedRooms[i]?.guestCount} onChange={(e) => handleChangeDetails(i, e.target.value, 'guestCount')}>
                                <option value=""></option>
                                {Array.from({ length: rooms.find(room => room.roomType === selectedRooms[i]?.roomType)?.maximumGuest }, (_, i) => 
                                <option value={i+1}>{i+1}</option>    
                            )
                                }
                            </select>
                        </div>      
                    )
                })}                

                <div className='container-buttons'>
                    <button onClick={() => add_div(1)}><span>+</span> ADD ROOM TYPE</button>
                    <button onClick={() => add_div(-1)} disabled={numberOfRooms === 1}>—</button>
                </div>
            </div>

            <form className="client-info-container" 
            onSubmit={(e) => {
                e.preventDefault();
                setShowSummary(true)
            }}>

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

                <button disabled={selectedRooms.some(room => {

                    return !(room.roomType && room.guestCount && room.checkInDate
                    && room.checkOutDate && room.roomLimit && room.price && room.gap)
                })}>PROCEED PAYMENT</button>
            </form>
        </div>
    )
}

export default ProcessWalkIn;