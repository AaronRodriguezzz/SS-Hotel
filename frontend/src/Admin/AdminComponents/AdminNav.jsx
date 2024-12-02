import './AdminNavStyle.css';

const AdminNav = ({onSectionChange}) => {
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
                <li onClick={() => onSectionChange('super-admin')}>Super Admin</li>
                <li onClick={() => onSectionChange('new-admin')} >New Admin</li>
                <li onClick={() => onSectionChange('admin-reports')} >Reports</li>
                <li onClick={() => onSectionChange('history')}>Reservation History</li>
            </ul>

            <button>LOG OUT</button>
        </div>
    )
}

export default AdminNav