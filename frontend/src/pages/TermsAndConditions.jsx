import React from "react";
import "./TermsAndConditions.css";
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import FloatingButton from '../Components/ChatBot';

const TermsAndConditions = () => {
  return (
    <>
    <NavBar/>
    <FloatingButton />
    <div className="terms-container">
      <header className="terms-header">
        <h1 className="terms-title">Terms and Conditions</h1>
      </header>
      <section className="terms-section">
        <h2 className="terms-subtitle">Introduction</h2>
        <p id='hotel-description'>
          Welcome to Silverstone Hotel. By booking a stay at our hotel, you
          agree to abide by the following terms and conditions. These terms are
          designed to ensure a safe, pleasant, and fair experience for all
          guests.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">Reservations</h2>
        <ul>
          <li>
            Reservations are subject to availability and are confirmed only
            upon receipt of payment or valid credit card information.
          </li>
          <li>A valid ID and credit card are required for check-in.</li>
          <li>
            Cancellations made within 48 hours of arrival may incur a charge
            equivalent to one night's stay.
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">Check-in and Check-out</h2>
        <ul>
          <li>Check-in time: 2:00 PM</li>
          <li>Check-out time: 12:00 NOON</li>
          <li>
            Late check-out requests are subject to availability and additional
            fees.
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">Payment Policy</h2>
        <ul>
          <li>
            All rates are quoted in local currency and include applicable taxes
            unless specified otherwise.
          </li>
          <li>
            Full payment is required at the time of check-in for all booked
            nights.
          </li>
          <li>Accepted payment methods include credit cards, debit cards, and cash.</li>
        </ul>
      </section>

    </div>
    <Footer/>
    </>
  );
};

export default TermsAndConditions;
