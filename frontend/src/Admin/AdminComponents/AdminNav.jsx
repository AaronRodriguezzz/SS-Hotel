import './AdminNavStyle.css';

const AdminNav = ({ onSectionChange, role }) => {
    
    const {securityClearance} = role;

    console.log('clearance : ', securityClearance);
    const handleLogOut = async () => {
        try{
            const response = await fetch('http://localhost:4001/logout', {
                method: 'POST',
                credentials: 'include',  
            });
            
            if(response.ok){
                const data = await response.json();
                alert(data.message);
                window.location.href = 'http://localhost:5173/admin/login';
            }else{
                alert(data.message);
            }
        }catch(err){
            console.log('Log Out err' ,err);
        }
    }

    return(
        <div className="nav">
           <img src='/photos/logo.png' alt='Logo' />

            <ul>
                <li onClick={() => onSectionChange('hotelRooms')}>Rooms</li>
                <li onClick={() => onSectionChange('reservations')}>Reservations</li>
                <li onClick={() => onSectionChange('processed')}>Processed Reservation</li>
                <li onClick={() => onSectionChange('walk-in')}>Process Walk In</li>
                <li onClick={() => onSectionChange('events')}>Events Booking</li>
                <li onClick={() => onSectionChange('restaurant')}>Restaurant Reservation</li>
                <li onClick={() => onSectionChange('super-admin')}
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                >Super Admin</li>
                <li onClick={() => onSectionChange('new-admin')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                >New Admin</li>
                <li onClick={() => onSectionChange('admin-reports')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                >Reports</li>
                <li onClick={() => onSectionChange('history')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                >Reservation History</li>
            </ul>

            <button onClick={handleLogOut}>LOG OUT</button>
        </div>
    )
}

export default AdminNav