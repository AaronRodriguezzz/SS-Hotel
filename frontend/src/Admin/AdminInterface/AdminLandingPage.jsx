import './AdminLandingPage.css';
import { useEffect,useState,} from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../AdminComponents/AdminNav'
import HotelRooms from '../AdminComponents/HotelRooms'
import Reservations from '../AdminComponents/ReservationTable'
import Processed from '../AdminComponents/ProcessedReservations'
import ReservationHistory from '../AdminComponents/ReservationHistory';
import NewAdmin from '../AdminComponents/NewAdmin';

const AdminPage = () => {
    const location = useLocation();
    const { employeeEmail } = location.state || {};
    const [activeSection, setActiveSection] = useState('hotelRooms');
    
    console.log(employeeEmail); // Verify the state is passed correctly

    const handleSectionChange = (section) => {
        setActiveSection(section); // Update the active section
        console.log(employeeEmail);
    };



    return(
        <>
            <div className="landingPage-container">
                <Navigation onSectionChange={handleSectionChange}/>
                {activeSection === 'hotelRooms' && <HotelRooms />}
                {activeSection === 'reservations' && <Reservations />}
                {activeSection === 'processed' && <Processed />}
                {activeSection === 'new-admin' && <NewAdmin />}
                {activeSection === 'history' && <ReservationHistory />}
            </div>
        </>
    )
}

export default AdminPage;