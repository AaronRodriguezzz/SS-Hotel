import { useEffect } from 'react'
import './ReservationSummary.css'

const BookingSummary = ({selectedRooms, submit, close}) => {
    
    return (
        <div className="ReservationSummary">
            <form onSubmit={submit}>
            <button type='button' onClick={close}>X</button>
            {selectedRooms && selectedRooms.map((room) => {
                    return(

                        <div className="reserved-rooms" key={room._id}>
                            <div className="roomType-roomPrice">
                                <h4>{room.roomType}</h4>
                                <h6>₱{room.price * room.gap}.00 for {room.gap} nights </h6>
                            </div>
                            
                            <p>Duration: {room.checkInDate} - {room.checkOutDate}</p>
                            <p>{room.guestCount} Guest(s)</p>

                        </div>
                    )
                })}
                <h2>Total: ₱{selectedRooms.reduce((total, room) => (room.price * room.gap) + total, 0)}</h2>
                <button className='finish-btn'>Finish</button>
            </form>
        </div>
    )
}

export default BookingSummary