import './RestaurantModal.css'

function restaurant_modal({onView}){

    return(
        <div className="modal-parent-container">
            <div className="modal-container">
                <img src="./photos/check.png" alt="check" />
                <h1>Your reservation is successful</h1>
                <button onClick={() => { onView(); window.open('https://mail.google.com/', '_blank')}}>Check Email</button>
            </div>
        </div>
    )
}

export default restaurant_modal;