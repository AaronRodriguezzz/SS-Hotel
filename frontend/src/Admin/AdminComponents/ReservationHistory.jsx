import { useEffect,useState,} from 'react';
import { formatDate, formatDateTime } from '../../utils/dateUtils';


const ReservationHistory = () => {
    const [history, setHistory] = useState();
    const [filteredBin, setFilteredBin] = useState([]); // Filtered reservations
    const [searchQuery, setSearchQuery] = useState(""); // Search input value
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const fetchHistory = async () => {    

        try{
            const response = await fetch('/api/history');
            const data = await response.json();
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
                    bin.remarks.toLowerCase().includes(searchQuery)
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

    useEffect(() => {
        const filterHistory = async () => {
            if(history && checkInDate <= checkOutDate &&  checkInDate != '' && checkOutDate != ''){
                setFilteredBin(history.filter(item => {
                    return formatDate(new Date(new Date(item.checkInDate).toISOString().split('T')[0])) === formatDate(new Date(checkInDate)) && 
                    formatDate(new Date(new Date(item.checkOutDate).toISOString().split('T')[0])) === formatDate(new Date(checkOutDate))
                }
             ))
            }
        }
        filterHistory ();
    }, [checkInDate, checkOutDate])

    const clear = async () => {
        setFilteredBin(history)
        setCheckInDate('')
        setCheckOutDate('');
    }

    const generateCSV = () => {
        const csvRows = [];
        const headers = ['Room Type', 'Check-In Date', 'Check-Out Date', 'Guest Name', 
            'Contact Number', 'Email', 'Total Guests', 'Total Price', 'Assigned Room', 'Remarks'
        ];
        csvRows.push(headers.join(',')); // Add header row

        // Add data rows
        filteredBin.forEach(row => {
        const values = [row.roomType, formatDateTime(new Date(row.checkInDate)), formatDateTime(new Date(row.checkOutDate)), row.guestName, row.guestContact, row.guestEmail, row.totalGuests, row.totalPrice, row.roomAssigned, row.remarks]
        csvRows.push(values);
        });

        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);

        // Create a link to download the CSV
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'reservation_history_report.csv';
        link.click();
    };

    return(
        <>
        <div class="parent-table-container">
            <div className='filter-container'>
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
                <div>
                    <p>Check In Date</p>
                    <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}/>
                </div>
                <div>
                    <p>Check Out Date</p>
                    <input type="date" value={checkOutDate} min={checkInDate} onChange={(e) => setCheckOutDate(e.target.value)}/>
                </div>
                <button onClick={() => clear()}>Clear</button>
            </div>
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
                        <th>Payment</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBin && (filteredBin.map((history, i) => {
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
                                <td>{history.modeOfPayment}</td>
                                <td>{history.remarks}</td>
                                <td>{formatDateTime(new Date(history.updatedAt))}</td>
                            </tr>
                        )
                    }))}
                </tbody>
            </table>
            </div>
            <button onClick={generateCSV} className='export-btn'>Export</button>
        </div>
        </>
       
    )
}

export default ReservationHistory;