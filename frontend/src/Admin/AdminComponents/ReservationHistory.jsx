import { useEffect,useState,} from 'react';
import { formatDateToWeekday } from '../../utils/dateUtils';


const ReservationHistory = () => {

    const [filteredBin, setFilteredBin] = useState([]); // Filtered reservations
    const [searchQuery, setSearchQuery] = useState(""); // Search input value


    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase(); // Normalize input for case-insensitivity
        setSearchQuery(query);

        // Filter reservations based on the query
        const filtered = filteredBin.filter((bin) => {
            return (
                bin.roomType.toLowerCase().includes(searchQuery) || 
                bin.guestName.toLowerCase().includes(searchQuery) ||
                bin.guestEmail.toLowerCase().includes(searchQuery) || 
                bin.checkInDate.toLowerCase().includes(searchQuery) ||
                bin.checkOutDate.toLowerCase().includes(searchQuery) 
            );
        });

        setFilteredBin(filtered);
    };

    useEffect(() => {
        const fetchHistory = async () => {    

            try{
                const response = await fetch('/api/history');
                const data = await response.json();

                console.log(data);
                if(response.ok){
                    setFilteredBin(data.history);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchHistory()
    },[]);


    return(
        <div className='parent-table-container'>
        <div className="table-container">
            <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                    marginBottom: "20px",
                    padding: "10px",
                    fontSize: "16px",
                    width: "40%",
                    borderRadius: "15px"
                }}
            />

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
                    {filteredBin && (filteredBin.map(history => {
                        return(
                            <tr key={history.updatedBy}>
                                <td>{history.updatedBy}</td>
                                <td>{history.roomType}</td>
                                <td>{formatDateToWeekday(new Date(history.checkInDate))}</td>
                                <td>{formatDateToWeekday(new Date(history.checkOutDate))}</td>
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
        </div>
    )
}

export default ReservationHistory;