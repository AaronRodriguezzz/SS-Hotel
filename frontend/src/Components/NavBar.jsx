import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import './NavBarStyle.css'

function NavBar({scrollToRooms,scrollToFooter,scrollToHotelAreas}) {
    const [isScrolled, setScrollPosition] = useState(false);
    const [scrollValue, setScrollValue] = useState(0);


    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 0 && currentScrollY <= 250) {
            setScrollPosition(true);
            setScrollValue(0.1);
        } else if (currentScrollY > 250 && currentScrollY <= 375) {
            setScrollPosition(true);
            setScrollValue(0.4);
        } else if (currentScrollY > 375 && currentScrollY <= 500) {
            setScrollPosition(true);
            setScrollValue(0.7);
        } else if (currentScrollY > 500) {
            setScrollPosition(true);
            setScrollValue(1);
        }else if (currentScrollY === 0) {
            setScrollPosition(false);
            setScrollValue(0);
        }

    };

    const restaurantClicked  = (event) => {
        event.preventDefault();
    }



    useEffect(() => {
        // Add event listener on mount
        window.addEventListener("scroll", handleScroll);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return(
        <div className='navigation'>

             {/* Navigation Bar */}
                <motion.nav
                    style={{ backgroundColor: isScrolled ? `rgba(42, 75, 96, ${scrollValue})` : "transparent" }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    >
                        <ul>
                        <Link to='/' className="no-underline">  
                            <li onClick={scrollToRooms}>OUR ROOMS</li>
                        </Link>
                        
                        <Link to='/Amenities' className="no-underline">  
                            <li onClick={scrollToHotelAreas}>HOTEL AREAS</li>
                        </Link>

                        </ul>

                        {/* Hotel Name */}
                        <motion.div
                            className="hotel-name"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 2 }}
                        >
                         <Link to='/' className="no-underline">
                            <img src='/photos/logo.png' alt='Logo' />
                            <h5>THE</h5>
                            <h2>SILVERSTONE</h2>
                            <h5>HOTEL</h5>
                        </Link>

                        </motion.div>

                        <ul>
                        <Link to='/restaurant' className="no-underline">  
                            <li>RESTAURANT</li>
                        </Link>

                        <li onClick={scrollToFooter}>CONTACT US</li>

                        </ul>
                        
                </motion.nav>
        </div>
    );
}

export default NavBar;