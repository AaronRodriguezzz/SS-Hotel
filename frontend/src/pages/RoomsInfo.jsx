
import './RoomsInfoStyle.css';
import { useEffect,useState, useRef} from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { useScroll } from '../Components/NavScroll'; 
import Footer from '../Components/Footer';
import NavBar from '../Components/NavBar';
import FloatingButton from '../Components/ChatBot';

const RoomInfo = () =>{
    const [bookedRoom, setBookedRoom] = useState([]);
    const {targetRefFooter, scrollToRooms, scrollToHotelAreas, scrollToFooter } = useScroll(); // Use the custom hook
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [daysGap, setDaysGap] = useState(0);
    const [minCheckOut, setMinCheckOut] = useState('');
    const targetForm = useRef(null);
    const today = new Date().toISOString().split('T')[0];
    const {key} = useParams();
    const navigate = useNavigate();


    const scrollToForm = () => {
        targetForm.current?.scrollIntoView({ behavior: 'smooth' });
    }

    /*const handleBook = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior


        if ( bookedRoom && checkInDate !== '' && checkOutDate !== '') {  
            const inDate = new Date(checkInDate);
            const outDate = new Date(checkOutDate);
            const daysGap = Math.floor((outDate - inDate) / (1000 * 60 * 60 * 24))       
            
            if(bookedRoom.length !== 0){
                navigate('/booking/confirmation', {
                    state: {bookedRoom, daysGap, checkInDate, checkOutDate },
                });
            }
        }
    }*/

    
    useEffect(() => {
        const inDate = new Date(checkInDate);
        const outDate = new Date(checkOutDate);
        const calculatedGap = Math.floor((outDate - inDate) / (1000 * 60 * 60 * 24))  
        setDaysGap(calculatedGap);

        /*if ( bookedRoom.length !== 0 && daysGap !== 0 ) {
            // Delay navigation until selectedRooms is not empty
            navigate('/booking/confirmation', {
                state: {bookedRoom, daysGap,checkInDate,checkOutDate },
            });
        }*/

    }, [bookedRoom, navigate, daysGap]);

    

    useEffect(() => {
        const fetchDate = async () => {

            try{
                const response = await fetch(`/api/rooms/${key}`);
                const json = await response.json();

                if(response.ok){
                    setBookedRoom(json);
                }
            }catch(err){
                console.error("Fetch error:", err);
            }
        } 

        fetchDate()
    }, [])   

    return(
        <>
            <NavBar scrollToRooms={scrollToRooms} scrollToFooter={scrollToFooter} scrollToHotelAreas={scrollToHotelAreas}/>
            <FloatingButton/>
            <div className="roomInfo-container"   style={{backgroundImage: `url('/photos/z${bookedRoom.roomType}.jpg')`}}>
                <div className='cover-color'>

                    <div className="room-info-txt">
                        <h2>{bookedRoom.roomType}</h2>
                        <h5>₱{bookedRoom.price} only</h5>
                        <p >{bookedRoom.roomDescription}</p>

                            <button type='button' ref={targetForm} onClick={() => window.location.href='/booknow'}>BOOK NOW</button>
                    </div>
                </div>
            </div>

            <Footer ref={targetRefFooter}/>
        </>
    )
}

export default RoomInfo;