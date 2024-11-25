// useScroll.js (Custom Hook)

import { useRef } from 'react';

// Custom hook for scrolling
export const useScroll = () => {
    const targetRefRooms = useRef(null); 
    const targetRefHotelAreas = useRef(null); 
    const targetRefFooter = useRef(null);

    const scrollToRooms = () => {
        targetRefRooms.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToHotelAreas = () => {
        targetRefHotelAreas.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToFooter = () => {
        targetRefFooter.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return { 
        targetRefRooms, 
        targetRefHotelAreas, 
        targetRefFooter, 
        scrollToRooms, 
        scrollToHotelAreas, 
        scrollToFooter 
    };
};
