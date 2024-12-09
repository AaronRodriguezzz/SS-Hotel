import { useEffect,useState,} from 'react';


const ProcessedReservation = () => {

    const [roomNums, setRoomNums] = useState([]);

    useEffect(() => {
        const fetchRoomNums = async () => {    

            try{
                const response = await fetch('/api/roomnum');
                const data = await response.json();

                console.log(data);
                
                if(response.ok){
                    setRoomNums(data.roomNums);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchRoomNums()
    },[]);


    return(
        <>
        <div class="parent-table-container">
            <div className="table-container">
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
                    {roomNums && (roomNums.map(roomNum => {
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

        </div>
        </>
       
    )
}

export default ProcessedReservation;