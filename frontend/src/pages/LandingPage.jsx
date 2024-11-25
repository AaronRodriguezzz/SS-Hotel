import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { useScroll } from '../Components/NavScroll';  // Import the custom hook

import './LandingPageStyle.css'



function FrontPage(){
    const [rooomNum, setRoomNum] = useState(0);
    const { targetRefRooms, targetRefHotelAreas, targetRefFooter, scrollToRooms, scrollToHotelAreas, scrollToFooter } = useScroll(); // Use the custom hook

    const handleRoomClick = (count) => {
        setRoomNum(count)
    }

    return(

        <div className='landing-page'>
            <div className="main-section">
                <div className="cover-color">
                    < NavBar scrollToRooms={scrollToRooms} scrollToFooter={scrollToFooter} scrollToHotelAreas={scrollToHotelAreas}/>

                    {/* Center Text */}
                    <div className="center-text">
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            <span>A</span>N <span>O</span>ASIS <span>O</span>F
                        </motion.h2>

                        <motion.h4
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                               Relaxation & Tranquility
                        </motion.h4>
                        <Link to='/booknow'>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: .9, delay: .8 }}
                            >
                                BOOK NOW
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>


            <motion.div className='hotel-primary-info'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}>

                <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    EXPERIENCE COMFORT
                </motion.h1>
                <div id="lobby-photo"></div>

                <h3>ONLY IN THE SILVERSTONE HOTEL</h3>
                <p>
                    Escape to The Silverstone Hotel, where luxury meets tranquility in every detail. Relax in elegantly designed rooms, 
                    indulge in fine dining, and rejuvenate with top-tier amenities—all thoughtfully crafted to make your stay unforgettable. 
                    Whether you seek a peaceful retreat or a vibrant city adventure, our team is dedicated to providing an exceptional experience
                    from the moment you arrive. Book your stay today and discover the perfect blend of comfort, style, and personalized service 
                    that awaits at The Silverstone.
                </p>
            </motion.div>

            <div className='hotel-rooms' ref={targetRefRooms}>
                <div className='rooms-section-header'>
                    <div className='side-text'>
                        <h4>WE CARE ABOUT THE DETAILS</h4>
                        <h2>OUR PROMO ROOMS</h2>
                    </div>

                    <button id="view-rooms-btn">VIEW ALL ROOMS</button>
                </div>  

                <div className='rooms'  style={{display: rooomNum === 0 ? "flex" : "none",
                                                animation: rooomNum === 0 ? "slide-in 1.5s ease forwards" : "none",
                                            }}>
                     <Link to='/room/1' className="room-link">
                        <div className='room'>
                            <img src='/photos/zDeluxe Suite.jpg' alt='Premiere Double Room' />
                            <div className='room-txt'>
                                <div className='room-info'>
                                    <h4>Deluxe Suite</h4>
                                    <h6>2 GUESTS</h6>
                                </div>

                                <div className='room-price'>
                                    <h6>from</h6>
                                    <h4>₱ 3,189 </h4>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to='/room/2' className="room-link">
                    <div  className='room'>
                        <img src='/photos/zDeluxe Double Suite.jpg' alt='Premiere Double Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Deluxe Double Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 5,389</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                    <Link to='/room/3' className="room-link">
                    <div id='suit-deluxe' className='room'>
                        <img src='/photos/zPremium Single Suite.jpg' alt='Suit Deluxe Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Premium Single Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 3,989</h4>
                            </div>
                        </div>
                    </div>
                    </Link>
                </div>   


                <div className='rooms-1' style={{display: rooomNum == 1 ? "flex" : "none",
                                                animation: rooomNum === 1 ? "slide-in 1.5s ease forwards" : "none",
                                                }}>
                    <Link to='/room/4' className="room-link">
                    <div id='primiere-room' className='room'>
                        <img src='/photos/zAccessible Suite.jpg' alt='Premiere Double Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Accessible Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 2,599</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                    <Link to='/room/5' className="room-link">                                    
                    <div id='primiere-room' className='room'>
                        <img src='/photos/zFamily Suite.jpg' alt='Premiere Double Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Family Suite</h4>
                                <h6>5-6 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 8,799</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                    <Link to='/room/6' className="room-link">                                    
                    <div id='suit-deluxe' className='room'>
                        <img src='/photos/zPet Friendly Suite.jpg' alt='Suit Deluxe Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Pet Friendly Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 4,079</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                </div>   


                <div className='rooms-2' 
                    style={{display: rooomNum === 2 ? "flex" : "none",
                            animation: rooomNum === 2 ? "slide-in 1.5s ease forwards" : "none",
                    }}>
                    <Link to='/room/3' className="room-link">                                    
                    <div id='primiere-room' className='room'>
                        <img src='/photos/zLong Stay Suite.jpg' alt='Premiere Double Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Long Stay Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 4,869</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                    <Link to='/room/8' className="room-link">                                    
                    <div id='primiere-room' className='room'>
                        <img src='/photos/zJunior Suite.jpg' alt='Premiere Double Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Junior Suite</h4>
                                <h6>2 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 6,489</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                    <Link to='/room/9' className="room-link">                                    
                    <div id='suit-deluxe' className='room'>
                        <img src='/photos/zPresidential Suite.jpg' alt='Suit Deluxe Room' />
                        <div className='room-txt'>
                            <div className='room-info'>
                                <h4>Presidential Suite</h4>
                                <h6>4 GUESTS</h6>
                            </div>

                            <div className='room-price'>
                                <h6>from</h6>
                                <h4>₱ 10,599</h4>
                            </div>
                        </div>
                    </div>
                    </Link>

                </div> 

                <div className='rooms-buttom-sec'>
                        <div className='bottom-butt'>
                            <button onClick={() => {handleRoomClick(0)}}></button>
                            <button onClick={() => {handleRoomClick(1)}}></button>
                            <button onClick={() => {handleRoomClick(2)}}></button>
                        </div>

                        <h1>Rates and Promo Offers are Exclusive to Online Bookings Only</h1>
                 </div>             
            </div>


            <div className='amenities'>
                <h4>MAKE YOUR STAY MEMORABLE</h4>
                <h2>OUR AMENITIES</h2>

                <div className='photos'  ref={targetRefHotelAreas}>
                    <div className='photo-container'>
                        <div className='color-cover'>
                            <img src='/photos/fitness-img.jpg' alt='Fitness Center' />
                            <div className='overlay-text'>
                                <h3>Fitness Gym</h3>
                                <p>Experience the elegance of our hotel ballroom, 
                                where luxury and versatility create the perfect setting
                                for unforgettable events. With stunning chandeliers, 
                                soaring ceilings, and customizable decor, its ideal for
                                weddings, galas, or corporate gatherings.
                                </p>
                            </div>                        
                        </div>
                    </div>
        
                    <div className='photo-container'>
                        <div className='color-cover'>
                            <img src='/photos/restaurant-img.jpg' alt='Restaurant' />
                            <div className='overlay-text'>
                                <h3>Restaurant</h3>
                                <p>Experience the elegance of our hotel ballroom, 
                                where luxury and versatility create the perfect setting
                                for unforgettable events. With stunning chandeliers, 
                                soaring ceilings, and customizable decor, its ideal for
                                weddings, galas, or corporate gatherings.
                                </p>
                            </div>                    
                        </div>
                    </div>

                    <div className='photo-container'>
                        <div className='color-cover'>
                            <img src='/photos/pool-img.jpg' alt='Restaurant' />
                            <div className='overlay-text'>
                                <h3>Pool Area</h3>
                                <p hidden>Experience the elegance of our hotel ballroom, 
                                where luxury and versatility create the perfect setting
                                for unforgettable events. With stunning chandeliers, 
                                soaring ceilings, and customizable decor, its ideal for
                                weddings, galas, or corporate gatherings.
                                </p>
                            </div>                        
                        </div>
                    </div>
                    <div className='photo-container'>
                        <div className='color-cover'>
                            <img src='/photos/ballroom-img.jpg' alt='Restaurant' />
                            <div className='overlay-text'>
                                <h3>Ballroom</h3>
                                <p>Experience the elegance of our hotel ballroom, 
                                where luxury and versatility create the perfect setting
                                for unforgettable events. With stunning chandeliers, 
                                soaring ceilings, and customizable decor, its ideal for
                                weddings, galas, or corporate gatherings.
                                </p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <Footer ref={targetRefFooter}/>
        </div>
        
        
    );
}

export default FrontPage;
