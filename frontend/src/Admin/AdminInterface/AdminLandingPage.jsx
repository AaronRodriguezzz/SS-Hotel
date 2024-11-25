import './AdminLandingPage.css';
import { useEffect,useState,} from 'react';
import Navigation from '../AdminComponents/AdminNav'
import HotelRooms from '../AdminComponents/HotelRooms'
import Reservations from '../AdminComponents/ReservationTable'




const AdminPage = () => {

    const [activeSection, setActiveSection] = useState('hotelRooms'); // Track active section

    const handleSectionChange = (section) => {
        setActiveSection(section); // Update the active section
        console.log(section);
    };

    return(
        <>
        <Navigation onSectionChange={handleSectionChange}/>
        {activeSection === 'hotelRooms' && <HotelRooms />}
        {activeSection === 'reservations' && <Reservations />}

        </>
    )
}

export default AdminPage;