import { useEffect, useState } from 'react'
import { delay, motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import './AmenitiesStyle.css'


const Amenities = () => {
    const photosArr = ['ballroom-img.jpg','fitness-img.jpg','pool-img.jpg','restaurant-bg.jpg'];
    const amenitiesTitle = ['BALLROOM AREA', 'FITNESS GYM', 'POOL AREA', 'FINE DINING RESTAURANT'];
    const amenitiesDescription = [
        "A spacious and opulent ballroom that can accommodate up to 500 guests, featuring high ceilings adorned with glistening chandeliers, elegantly arranged round tables with fine linens, and a grand dance floor. The room’s luxurious design is complemented by state-of-the-art audio-visual equipment, making it perfect for weddings, corporate events, and formal gatherings.",
        "A fully-equipped, expansive fitness center designed to cater to both cardio and strength training needs. This gym spans over 2000 square feet and features a wide range of modern equipment, from treadmills and elliptical machines to free weights and resistance machines. Large mirrors line the walls, and floor-to-ceiling windows provide a scenic view, making workouts both invigorating and enjoyable.", 
        "An inviting outdoor pool area covering a wide expanse, offering ample space for guests to relax and unwind. Surrounded by lush palm trees and furnished with comfortable sun loungers and shaded cabanas, this pool features a swim-up bar and a dedicated shallow area for families. Perfect for a day of relaxation, this oasis creates a tranquil escape under the sun.",
        "A large, elegantly designed restaurant that spans an impressive floor space and offers seating for over 100 guests. With plush, comfortable seating, warm ambient lighting, and contemporary decor, the restaurant boasts an open kitchen concept where diners can observe chefs at work. Signature dishes from around the world add a unique flair to this culinary haven, making it a popular spot for both casual dining and special occasions."
    ];
    const fadeInAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 2}, // Optional for smooth exit when changing images
        transition: { duration: 1.5}
    }

    const [divIndex, setDivIndex ] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {
            setDivIndex((prevIndex) => (prevIndex + 1) % photosArr.length); 
           
        }, 5000);

        return () => clearInterval(interval);
    },[divIndex])

    return(
        <>
            <NavBar />
                <div 
                    key={divIndex} // Unique key for each element in the array
                    className='amenities-page' 
                    style={{ backgroundImage: `url('/photos/${photosArr[divIndex]}')` }} 
                    {...fadeInAnimation}
                >
                <div className='cover'>
                    <motion.h1 {...fadeInAnimation}>{amenitiesTitle[divIndex]}</motion.h1>
                    <motion.p {...fadeInAnimation}>{amenitiesDescription[divIndex]}</motion.p>
                    <motion.button {...fadeInAnimation}>BOOK NOW</motion.button>
                </div>
            </div>
        </>
    )
}

export default Amenities;