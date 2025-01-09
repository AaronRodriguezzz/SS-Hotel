import './RestaurantTerms.css'

import React from "react";
import "./TermsOverlay.css";

const RestaurantTerms = ({ onAccept, onDecline }) => {
  return (
    <div className="restaurant-overlay-container">
      <div className="restaurant-overlay-content">
        <h2>Welcome to Silverstone Restaurant!</h2>
        <p>
          Before confirming your reservation or proceeding to payment, please
          review and acknowledge the following policies to ensure a smooth and
          enjoyable stay.
        </p>
        <hr />
        <h3>Restuarant Reservation Policy</h3>
        <ul>
          <li>All reservations are subject to availability.</li>
          <li>There's 3 hours dining time</li>
          <li>Reservation cannot be cancelled. The reservation payment will not be refunded</li>
          <li>
            Early check-in and late check-out are subject to availability and
            may incur additional charges.
          </li>
          <li>Guests must present a valid ID upon arriving to the restaurant</li>
          <li>We value punctuality. Guests should arrived on time. Reservation time will not be move if the client arrived late</li>
          <li>All guests are expected to respect restaurant property and other patrons.</li>
          <li>Smoking is prohibited in all indoor areas. Designated smoking areas are available outside.</li>
          <li>Disruptive behavior may result in removal from the premises.</li>
          <li>Silverstone Restaurant is not liable for any loss, damage, or injury to guests or their property while on the premises, except as mandated by applicable law.</li>
        </ul>

        <div className="terms-footer">
          <button className="accept-button" onClick={onAccept}>
            I Accept These Terms
          </button>
          <button className="cancel-button" onClick={onDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTerms;
