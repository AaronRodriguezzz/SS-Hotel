import { motion } from 'framer-motion';
import { useState } from 'react';
import { useScroll } from '../Components/NavScroll';  // Import the custom hook
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import './Restaurant.css';


function Restaurant(){  
    
    const { targetRefRooms, targetRefHotelAreas, targetRefFooter, scrollToRooms, scrollToHotelAreas, scrollToFooter } = useScroll(); // Use the custom hook
    const [reservationName, setReservationName] = useState(''); 
    const [hotelCode, setHotelCode] = useState(''); 
    const [dinerCount, setDinerCount] = useState(''); 
    const [reserveDate, setReserveDate] = useState(''); 
    const [reserveTime, setReserveTime] = useState(''); 
    const today = new Date().toISOString().split('T')[0];
    const minReserveTime = "06:00";
    const maxReserveTime = "24:00";


    const [reserveIsClicked, setReserveClicked] = useState(false);
    const handleReserverClicked = (visible) => {
        setReserveClicked(visible);
    }

    return(
        <>
           < NavBar scrollToRooms={scrollToRooms} scrollToFooter={scrollToFooter} scrollToHotelAreas={scrollToHotelAreas}/>
            <div className="restaurant-content">    
                <div className="cover-color">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        THE EPITOME OF LUXURY DINING
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Savor the Symphony of flavors as luxury meets culinary mastery
                        at our exquisite hotel's Fine Dining Restaurant
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: .9, delay: .8 }}
                        onClick={() => handleReserverClicked(true)}
                    >
                        RESERVE TABLE
                    </motion.button>     
                    
                    <div className='form-container'
                        style={{display: reserveIsClicked ? 'flex' : 'none'}}>
                        <form>
                            <h1>REGISTRATION FORM</h1>
                            <input 
                                type='text' 
                                placeholder='Reservation Name' 
                                value={reservationName} 
                                onChange={(e) => setReservationName(e.target.value)} 
                                required 
                            />

                            <input 
                                type='text' 
                                placeholder='Hotel Unique Code' 
                                value={hotelCode} 
                                onChange={(e) => setHotelCode(e.target.value)} /*MAKE SURE TO VALIDATE INPUT IF IT EXIST ON THE RESERVATION OF THE HOTEL */
                                required 
                            /> 

                            <input 
                                type='number' 
                                placeholder='Diner Count' 
                                value={dinerCount} 
                                onChange={(e) => setDinerCount(e.target.value)} 
                                max={6}
                                min={1}
                                required 
                            /> 

                            <input 
                                type='date' 
                                placeholder='Date' 
                                value={reserveDate} 
                                onChange={(e) => setReserveDate(e.target.value)}  /* MAKE SURE TO RECEIVE INPUT WITHIN TODAY OR WITHIN THEIR STAY */
                                min={today}
                                required 
                            />

                            <input 
                                type='time' 
                                placeholder='Time' 
                                value={reserveTime}  
                                onChange={(e) => setReserveTime(e.target.value)}     /* MAKE SURE TO RECEIVE INPUTS WITHIN THE OPERATING HOURS*/
                                min={minReserveTime}
                                max={maxReserveTime}
                                required 
                            />  

                            <div className='buttons'>
                                <button type='submit'>RESERVE</button>
                                <button type='button' id='cancel'
                                        onClick={() => handleReserverClicked(false)}
                                >X</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer ref={targetRefFooter}/>
        </>
        
    );
}

export default Restaurant;