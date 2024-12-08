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
    const [securityClearance,setSecurityClearance] = useState('');
    const [adminName,setAdminName] = useState('');

    useEffect(() => {
        const checkSecurity = async () => { 
            try{
                const response = await fetch(`/api/check-clearance/${employeeEmail}`);
                
                if(response.ok){
                    const data = await response.json();
                    setAdminName(data.name);
                    setSecurityClearance(data.clearance);
                }
            }catch(err){
                console.log('secuity check error:' , err);
            }
        } 

        checkSecurity();
    },[])


    const handleSectionChange = (section) => {
        setActiveSection(section); // Update the active section
    };

    return(
        <>
            <div className="landingPage-container">
                <Navigation onSectionChange={handleSectionChange} role={{ securityClearance}}/>
                {activeSection === 'hotelRooms' && <HotelRooms />}
                {activeSection === 'reservations' && <Reservations name={{adminName}} />}
                {activeSection === 'processed' && <Processed />}
                {activeSection === 'walk-in' && <ProcessWalkIn />}
                {activeSection === 'new-admin' && <NewAdmin name={{adminName}} />}
                {activeSection === 'super-admin' && <AdminTable />}
                {activeSection === 'history' && <ReservationHistory />}
            </div>
        </>
    )
}

export default AdminPage;