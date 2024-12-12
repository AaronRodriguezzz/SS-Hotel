import { useEffect,useState,} from 'react';
import './HotelRooms.css'


const HotelRooms = () => {

    const [rooms, setRooms] = useState([]);
    const [viewIsClicked, setViewIsClicked] = useState(true);
    const [individualRoom, setIndividualRoom] = useState([]);

    const fetch_specific_room = async (room) => {
        setViewIsClicked(false);

        try{
            const response = await fetch(`/api/room_details/${room}`);
            const data = await response.json(); 
            console.log(data);
            if(response.ok){
                setIndividualRoom(data.specificRoom);
            }
        }catch(err){
            console.log(err);
        }
    
    }

    const handleClickBack = () => {
        setViewIsClicked(true);     
    }

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

   
    return (
        <div>
            {viewIsClicked ? (
                <div className="main">
                {rooms && rooms.length > 0 ? (
                    rooms.map((room) => (
                    <div
                        className="container"
                        key={room.key}
                        style={{
                        backgroundImage: `url('/photos/z${room.roomType}.jpg')`,
                        }}
                    >
                        <div className="cover" onClick={() => fetch_specific_room(room.roomType)}>
                        <h2>{room.roomType}</h2>
                        <h4>{room.roomLimit} available</h4>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>No rooms available.</p>
                )}
                </div>
            ) : (
                <div class="parent-table-container">
                     <button style={{
                                        border: "none", 
                                        backgroundColor: "transparent", 
                                        fontSize: "50px", 
                                        padding: "0px", 
                                        outline:"none",
                                        color: "rgb(212, 188, 52)"

                                    }}
                            onClick={handleClickBack}
                    > ← </button>
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
                </div>
            )}
        </div>
    );
}
    

export default HotelRooms