import { useEffect,useState,} from 'react';


const RecycleBin = () => {
    const [filteredBin, setFilteredBin] = useState([]); // Filtered reservations
    const [searchQuery, setSearchQuery] = useState(""); // Search input value

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase(); // Normalize input for case-insensitivity
        setSearchQuery(query);

        // Filter reservations based on the query
        const filtered = filteredBin.filter((bin) => {
            return (
                bin.roomType.toLowerCase().includes(query) || 
                bin.guestName.toLowerCase().includes(query) ||
                bin.guestEmail.toLowerCase().includes(query) || 
                bin.checkInDate.toLowerCase().includes(query) ||
                bin.checkOutDate.toLowerCase().includes(query) 
            );
        });

        setFilteredBin(filtered);
    };


    useEffect(() => {
        const fetchBin = async () => {    
            try{
                const response = await fetch(`/api/recyclebin`);
                const data = await response.json();

                if(response.ok){
                    setFilteredBin(data.bin);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchBin()  
    },[]);

    return(
        <div class="table-container">
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
                        <th>Check In Date</th>
                        <th>Check Out Date</th>
                        <th>Guest Name</th>
                        <th>Guest Contact</th>
                        <th>Guest Email</th>
                        <th>Total Rooms</th>
                        <th>Total Guests</th>
                        <th>Total Price</th>
                        <th>Remarks</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {filteredBin && filteredBin.length > 0 ? (filteredBin.map(bin => {
                        return(
                            <tr key={bin.updatedBy}>
                                <td>{bin.updatedBy}</td>
                                <td>{bin.roomType}</td>
                                <td>{bin.checkInDate}</td>
                                <td>{bin.checkOutDate}</td>
                                <td>{bin.guestName}</td>
                                <td>{bin.guestContact}</td>
                                <td>{bin.guestEmail}</td>
                                <td>{bin.totalRooms}</td>
                                <td>{bin.totalGuests} Guests</td>
                                <td>₱ {bin.totalPrice}. 00</td>
                                <td>{bin.remarks}</td>
                                <td><button></button></td>
                            </tr>
                        )
                    })):''}

                </tbody>
            </table>
        </div>
    )
}

export default RecycleBin;