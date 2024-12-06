import './AdminLandingPage.css';
import { useEffect,useState,} from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../AdminComponents/AdminNav'
import HotelRooms from '../AdminComponents/HotelRooms'
import Reservations from '../AdminComponents/ReservationTable'
import Processed from '../AdminComponents/ProcessedReservations'
import ReservationHistory from '../AdminComponents/ReservationHistory';
import NewAdmin from '../AdminComponents/NewAdmin';
import AdminTable from '../AdminComponents/AdminTable';
import ProcessWalkIn from '../AdminComponents/ProcessWalkin';

const AdminPage = () => {
    const location = useLocation();
    const { employeeEmail } = location.state || {};
    const [activeSection, setActiveSection] = useState('hotelRooms');

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
                {activeSection === 'walk-in' && <ProcessWalkIn />}
                {activeSection === 'new-admin' && <NewAdmin />}
                {activeSection === 'super-admin' && <AdminTable />}
                {activeSection === 'history' && <ReservationHistory />}
            </div>
        </>
    )
}

export default AdminPage;