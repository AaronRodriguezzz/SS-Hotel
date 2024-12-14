import './AdminLandingPage.css';
import { useEffect,useState,} from 'react';
import Navigation from '../AdminComponents/AdminNav'
import HotelRooms from '../AdminComponents/HotelRooms'
import Reservations from '../AdminComponents/ReservationTable'
import Processed from '../AdminComponents/ProcessedReservations'
import ReservationHistory from '../AdminComponents/ReservationHistory';
import NewAdmin from '../AdminComponents/NewAdmin';
import AdminTable from '../AdminComponents/AdminTable';
import ProcessWalkIn from '../AdminComponents/ProcessWalkin';
import AdminReports from '../AdminComponents/AdminReports';
import RestaurantReservations from '../AdminComponents/RestaurantReservations';


const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('hotelRooms');
    const [securityClearance,setSecurityClearance] = useState('');
    const [adminName,setAdminName] = useState('');

    useEffect(() => {
        const checkSecurity = async () => { 
            try{
                const response = await fetch(`/api/check-clearance`);
                
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
                <Navigation onSectionChange={handleSectionChange} role={{ securityClearance }} name={{adminName}} choosen={activeSection}/>
                {activeSection === 'hotelRooms' && <HotelRooms />}
                {activeSection === 'reservations' && <Reservations name={{adminName}} />}
                {activeSection === 'processed' && <Processed />}
                {activeSection === 'walk-in' && <ProcessWalkIn />}
                {activeSection === 'new-admin' && <NewAdmin name={{adminName}} />}
                {activeSection === 'super-admin' && <AdminTable />}
                {activeSection === 'admin-reports' && <AdminReports />}
                {activeSection === 'history' && <ReservationHistory />}
                {activeSection === 'restaurant' && <RestaurantReservations />}

            </div>
        </>
    )
}

export default AdminPage;