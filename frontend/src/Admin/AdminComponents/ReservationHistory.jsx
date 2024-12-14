import { useEffect,useState,} from 'react';
import { formatDate, formatDateTime } from '../../utils/dateUtils';


const ReservationHistory = () => {
    const [history, setHistory] = useState();
    const [filteredBin, setFilteredBin] = useState([]); // Filtered reservations
    const [searchQuery, setSearchQuery] = useState(""); // Search input value

    const fetchHistory = async () => {    

        try{
            const response = await fetch('/api/history');
            const data = await response.json();

            console.log(data);
            if(response.ok){
                setHistory(data.history);
            }
    
        }catch(err){
            console.log(err);
        }
    }

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase(); // Normalize input for case-insensitivity
        setSearchQuery(query);
        // Filter reservations based on the query
        const filtered = history.filter((bin) => {
                return (
                    bin.roomType.toLowerCase().includes(searchQuery) || 
                    bin.guestName.toLowerCase().includes(searchQuery) ||
                    bin.guestEmail.toLowerCase().includes(searchQuery) || 
                    bin.checkInDate.toLowerCase().includes(searchQuery) ||
                    bin.checkOutDate.toLowerCase().includes(searchQuery) 
                );
            });

        setFilteredBin(filtered)
    };

    useEffect(() => {
        fetchHistory()
    },[]);

    useEffect(() => {
        if(history) setFilteredBin(history);
    }, [history])

    return(
        <>

        
        <div class="parent-table-container">
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

            <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Updated By</th>
                        <th>Room Type</th>
                        <th>Check-In Date</th>
                        <th>Check-Out Date</th>
                        <th>Guest Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Total Guests</th>
                        <th>Total Price</th>
                        <th>Assigned Room</th>
                        <th>Remarks</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBin && (filteredBin.map((history, i) => {
                        console.log(history)
                        return(
                            <tr key={i}>
                                <td>{history.updatedBy}</td>
                                <td>{history.roomType}</td>
                                <td>{formatDate(new Date(history.checkInDate))}</td>
                                <td>{formatDate(new Date(history.checkOutDate))}</td>
                                <td>{history.guestName}</td>
                                <td>{history.guestContact}</td>
                                <td>{history.guestEmail}</td>
                                <td>{history.totalGuests}</td>
                                <td>{history.totalPrice}</td>
                                <td>{history.roomAssigned}</td>
                                <td>{history.remarks}</td>
                                <td>{formatDateTime(new Date(history.updatedAt))}</td>
                            </tr>
                        )
                    }))}
                </tbody>
            </table>
            </div>
        </div>
        </>
       
    )
}

export default ReservationHistory;