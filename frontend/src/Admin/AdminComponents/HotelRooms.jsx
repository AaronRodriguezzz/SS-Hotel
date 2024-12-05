import { useEffect,useState,} from 'react';
import './HotelRooms.css'
import IndividualRoomTable from './Admin/AdminComponents/IndividualRoomsTable';


const HotelRooms = () => {

    const [rooms, setRooms] = useState([]);


    useEffect(() => {
        const fetchRooms = async () => {    
            try{
                const response = await fetch('http://localhost:4001/roomdata');
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


    return(
        <div className='main'>
            {rooms && rooms.length > 0 ? (rooms.map(room => {
                return(
                    <div className="container" key={room.key}  style={{backgroundImage: `url('/photos/z${room.roomType}.jpg')`}}>
                        <div className="cover" onClick={<IndividualRoomTable />}>
                            <h2>{room.roomType}</h2>
                            <h4>{room.roomLimit} available</h4>
                        </div>
                    </div>
                )
                    
            })):  <p>No rooms available.</p>}
        </div>
    )
}

export default HotelRooms