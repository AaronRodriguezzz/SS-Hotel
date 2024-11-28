import { useEffect,useState,} from 'react';
import './ReservationTable.css'


const ReservationTable = () => {

    const [reservations, setReservations] = useState([]);
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [roomCountToAssign, setRoomCountToAssign] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const handleDelete = async (reservation) => {
        try{

            const dataToSend = {...reservation, updatedBy: 'Aaron', remarks:'Cancelled'}

            const updateBin = await fetch(`http://localhost:4000/updateBin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dataToSend)
            });


            const updateBinData = await updateBin.json();
            if(updateBinData.ok){
                const cancel = await fetch(`http://localhost:4000/cancelReservation/${reservation._id}`);
                const data = await cancel.json();

                if(data.ok){
                    alert('Deleting data from reservations failed');
                }
            }else{
                alert('Error on inserting data to the recycle bin');
            }

    
        }catch(err){
            console.log(err);
        }
    }

    const handleAssign = async (reservation) => {
        
        try{
            const response = await fetch(`http://localhost:4000/roomsAvailable/${reservation.roomType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json' // Optional for GET, can omit
                }
            });

            const data = response.json();
            if(data.ok){
                setRoomsAvailable(data.availableRooms);
                setShowForm(true);
                setRoomCountToAssign(reservation.totalRooms);
            }
            
           
        }catch(err){
            console.log(err);
        }
    }

    const handleSubmit = () => {

    }

    useEffect(() => {
        const fetchReservations = async () => {    
            try{
                const response = await fetch('http://localhost:4000/reservations');
                const data = await response.json();

                if(response.ok){
                    setReservations(data.reservations);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchReservations()
    },[]);

    return(

        <>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Room Type</th>
                            <th>Check-In Date</th>
                            <th>Check-Out Date</th>
                            <th>Guest Name</th>
                            <th>Contact Number</th>
                            <th>Guest Email</th>
                            <th>Room Quantity</th>
                            <th>Guest Quantity</th>
                            <th>Price Paid</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations && reservations.length > 0 ? (reservations.map(reservation => {
                            return(
                                <tr key={reservation.checkInDate}>
                                    <td>{reservation.roomType}</td>
                                    <td>{reservation.checkInDate}</td>
                                    <td>{reservation.checkOutDate}</td>
                                    <td>{reservation.guestName}</td>
                                    <td>{reservation.guestContact}</td>
                                    <td>{reservation.guestEmail}</td>
                                    <td>{reservation.totalRooms}</td>
                                    <td>{reservation.totalGuests}</td>
                                    <td>{reservation.totalPrice}</td>
    
                                    <td className='buttons'>
                                        <button onClick={() => handleAssign(reservation)}>Assign Room</button>
    
                                        <button onClick={() => handleDelete(reservation)}>Cancel</button>
                                    </td>
                                </tr>
                            )
                        })):''}
                    </tbody>
                </table>

                <form className='assigned-form' style={{display: showForm ? "flex": "none"}}>
                        <button style={{position: "absolute",
                                        backgroundColor: "transparent",
                                        width:"20px",
                                        height:"20px",
                                        color: "red",
                                        top: "-40px",
                                        right: "0",
                                        border:"none",
                                    }}
                                onClick={(e) => setShowForm(false)}
                        >X</button>
                        
                        {Array.from({ length: roomCountToAssign }, (_, i) => {
                            return (
                                <div key={i}>
                                    <label>Room {_i + 1}</label>
                                    <select name={`room-${_i}`} id={`room-${_i}`}>
                                        {roomsAvailable && roomsAvailable.map(rooms => {
                                            <option value={rooms.roomNumber}>{rooms.roomNumber}</option>
                                        })}
                                    </select>
                                </div>
                            );
                        })}

                    <button>ASSIGN</button>
                </form> 
            </div>
        </>
           
    )
   
}

export default ReservationTable;