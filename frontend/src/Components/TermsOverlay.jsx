import React from "react";
import "./TermsOverlay.css";

const TermsOverlay = ({ onAccept, onCancel }) => {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <h2>Welcome to Silverstone Hotel!</h2>
        <p>
          Before confirming your reservation or proceeding to payment, please
          review and acknowledge the following policies to ensure a smooth and
          enjoyable stay.
        </p>
        <hr />
        <h3>1. Reservation Policy</h3>
        <ul>
          <li>All reservations are subject to availability.</li>
          <li>A valid credit/debit card is required to secure your booking.</li>
          <li>
            Early check-in and late check-out are subject to availability and
            may incur additional charges.
          </li>
          <li>Guests must present a valid ID upon check-in.</li>
          <li>Check-in time is 2:00 pm - Check-out time is 12:00 pm</li>

        </ul>
        <h3>2. Payment Policy</h3>
        <p>Full payment is required at the time of booking unless stated otherwise.</p>
        <p>Accepted payment methods include credit cards, debit cards, and cash.</p>

        <div className="terms-footer">
          <button className="accept-button" onClick={onAccept}>
            I Accept These Terms
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOverlay;
