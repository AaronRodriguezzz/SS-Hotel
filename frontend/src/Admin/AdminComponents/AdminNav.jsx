import './AdminNavStyle.css';

const AdminNav = ({ onSectionChange,role,name, choosen }) => {
    
    const {securityClearance} = role;
    const {adminName} = name;


    console.log('clearance : ', securityClearance);
    const handleLogOut = async () => {
        try{
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',  
            });
            
            if(response.ok){
                const data = await response.json();
                alert(data.message);
                window.location.href = '/admin/login';
            }else{
                alert(data.message);
            }
        }catch(err){
            console.log('Log Out err' ,err);
        }
    }

    const styleNav = (key) => {
        if(choosen !== ''){
            if(choosen === key){
                return true
            }
        }
        return false
    }

    return(
        <div className="nav">
           <img src='/photos/logo.png' alt='Logo' />
            <ul>
                <li className={`${styleNav('hotelRooms') ? 'active': '' }`} onClick={() => onSectionChange('hotelRooms')}>Rooms</li>
                <li className={`${styleNav('reservations') ? 'active': '' }`} onClick={() => onSectionChange('reservations')}>Reservations</li>
                <li className={`${styleNav('processed') ? 'active': '' }`} onClick={() => onSectionChange('processed')}>Processed Reservation</li>
                <li className={`${styleNav('walk-in') ? 'active': '' }`} onClick={() => onSectionChange('walk-in')}>Process Walk In</li>
                <li className={`${styleNav('restaurant') ? 'active': ''}`} onClick={() => onSectionChange('restaurant')}>Restaurant Reservation</li>
                <li className={`${styleNav('super-admin') ? 'active': ''}  ${choosen === ''}`} onClick={() => onSectionChange('super-admin')}
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                >Super Admin</li>
                <li onClick={() => onSectionChange('new-admin')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                    className={`${styleNav('new-admin') ? 'active': ''}`}
                >New Admin</li>
                <li onClick={() => onSectionChange('admin-reports')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                    className={`${styleNav('admin-reports') ? 'active': ''}`}
                >Reports</li>
                <li onClick={() => onSectionChange('history')} 
                    style={{display: securityClearance === 'Super Admin' ? "block":"none"}}
                    className={`${styleNav('history') ? 'active': ''}`}
                >Reservation History</li>
            </ul>
            <div onClick={handleLogOut} id='logout'>
                <div className='admin-basic-info'>
                    <p>{adminName}</p>
                    <p>{securityClearance}</p>
                </div>
                <img src="./photos/logout.png" alt="log out" />
            </div>
        </div>
    )
}

export default AdminNav