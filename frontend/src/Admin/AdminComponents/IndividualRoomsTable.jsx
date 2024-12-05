

const IndividualRoomTable = () => {
    const [individualRoom, setIndividualRoom] = useState([]);

    useEffect(() => {
        const fetchRoomDetails = async () => {    

            try{
                const response = await fetch(`http://localhost:4001/room_details/${room}`);
                const data = await response.json();

                if(response.ok){
                    setIndividualRoom(data.specificRoom);
                }
            }catch(err){
                console.log(err);
            }
        }

        fetchRoomDetails()
    },[]);


    return(
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Room Type</th>
                        <th>Check-In Date</th>
                        <th>Check-Out Date</th>
                        <th>Guest Name</th>
                        <th>Contact Number</th>
                        <th>Status</th>
                        <th>Updated At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {individualRoom && (individualRoom.map(roomNum => {
                        return(
                            <tr key={roomNum.roomNumber}>
                                <td>{roomNum.roomNumber}</td>
                                <td>{roomNum.roomType}</td>
                                <td>{roomNum.checkInDate}</td>
                                <td>{roomNum.checkOutDate}</td>
                                <td>{roomNum.clientName}</td>
                                <td>{roomNum.contactNumber}</td>
                                <td>{roomNum.status}</td>
                                <td>{roomNum.updatedAt}</td>
                                <td>
                                    <button style={{width: "100%", fontSize: "18px",}} disabled={roomNum.clientName === ""} onClick={console.log('clicked')}>Check Out</button>
                                </td>
                            </tr>
                        )
                    }))}
                </tbody>
            </table>
        </div>
    )
}

export default IndividualRoomTable;