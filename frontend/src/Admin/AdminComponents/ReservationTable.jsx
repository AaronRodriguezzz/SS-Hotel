import { useEffect,useState,} from 'react';
import './ReservationTable.css'


const ReservationTable = () => {

    const [reservations, setReservations] = useState([]);

    const handleDelete = (id) => {

    }

    useEffect(() => {
        const fetchReservations = async () => {    
            try{
                const response = await fetch('http://localhost:4001/get/reservations');
                const data = await response.json();

                if(response.ok){
                    setReservations(data.rooms);
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
                            <tr key={reservation._id}>
                                <td>{reservation.roomType}</td>
                                <td>{reservation.checkInDate}</td>
                                <td>{reservation.checkOutDate}</td>
                                <td>{reservation.guestName}</td>
                                <td>{reservation.guestContact}</td>
                                <td>{reservation.guestEmail}</td>
                                <td>{reservation.totalRooms}</td>
                                <td>{reservation.totalGuests}</td>
                                <td>{reservation.totalPrice}</td>
                                <td>
                                    <button><img src="/photos/delete.png" alt="delete" onClick={() => handleDelete(reservation._id)}/></button>
                                     <button><img src="/photos/update.png" alt="Update" /></button>
                                </td>
                            </tr>
                        )
                    })):''}
                </tbody>
            </table>
        </div>

        <div className="choice-form">
            <button>ASSIGN ROOM</button>
                    
            <button>CANCEL RESERVATION</button>
        </div>

        </>
       
    )
}

export default ReservationTable;