import './AdminLandingPage.css';
import { useEffect,useState,} from 'react';
import Navigation from '../AdminComponents/AdminNav'
import HotelRooms from '../AdminComponents/HotelRooms'
import Reservations from '../AdminComponents/ReservationTable'
import Processed from '../AdminComponents/ProcessedReservations'
import ReservationHistory from '../AdminComponents/ReservationHistory';


const AdminPage = () => {

    const [activeSection, setActiveSection] = useState('hotelRooms'); // Track active section

    const handleSectionChange = (section) => {
        setActiveSection(section); // Update the active section
        console.log(section);
    };

    return(
        <>
            <div className="landingPage-container">
                <Navigation onSectionChange={handleSectionChange} role={activeSection}/>
                {activeSection === 'hotelRooms' && <HotelRooms />}
                {activeSection === 'reservations' && <Reservations />}
                {activeSection === 'processed' && <Processed />}
                {activeSection === 'history' && <ReservationHistory />}

            </div>
            
        </>
    )
}

export default AdminPage;