import { useEffect,useState,} from 'react';


const IndividualRoomTable = (hook) => {
    const [individualRoom, setIndividualRoom] = useState([]);

    useEffect(() => {
        const fetchRoomDetails = async () => {    

            try{
                const response = await fetch(`http://localhost:4001/room_details/${hook.room}`);
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
        
    )
}

export default IndividualRoomTable;