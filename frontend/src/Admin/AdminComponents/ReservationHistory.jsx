import { useEffect,useState,} from 'react';


const ReservationHistory = () => {

    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {    

            try{
                const response = await fetch('http://localhost:4000/history');
                const data = await response.json();

                console.log(data);
                if(response.ok){
                    setHistory(data.history);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchHistory()
    },[]);


    return(
        <>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Updated By</th>
                        <th>Room Type</th>
                        <th>Check-In Date</th>
                        <th>Check-Out Date</th>
                        <th>Guest Name</th>
                        <th>Contact Number</th>
                        <th>Total Rooms</th>
                        <th>Total Guests</th>
                        <th>Total Price</th>
                        <th>Assigned Room</th>
                        <th>Remarks</th>
                        <th>Updated At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history && (history.map(history => {
                        return(
                            <tr key={history.updatedBy}>
                                <td>{history.updatedBy}</td>
                                <td>{history.roomType}</td>
                                <td>{history.checkInDate}</td>
                                <td>{history.checkOutDate}</td>
                                <td>{history.guestName}</td>
                                <td>{history.guestContact}</td>
                                <td>{history.guestEmail}</td>
                                <td>{history.totalRooms}</td>
                                <td>{history.totalGuests}</td>
                                <td>{history.totalPrice}</td>
                                <td>{history.remarks}</td>
                                <td>{history.updatedAt}</td>
                                <td>
                                    <button style={{backgroundColor: "rgb(212, 188, 52)", color: "white", width:"110"}}>Check Out</button>
                                </td>
                            </tr>
                        )
                    }))}
                </tbody>
            </table>
        </div>
        </>
       
    )
}

export default ReservationHistory;