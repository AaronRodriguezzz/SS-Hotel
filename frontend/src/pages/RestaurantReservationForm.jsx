import React, { useState } from "react";
import "./RestaurantReservation.css"; // Create this CSS file for styling
import Calendar from '../Components/RestaurantCalendar'
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation details:", formData);
    alert("Thank you! Your reservation has been submitted.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: "",
    });
  };

  return (
    <>
    <NavBar/>
    <div className="reservation-container">
      <div>
      <h1 className="reservation-title">Restaurant Reservation</h1>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />  
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Number of Guests:
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            min="1"
          />
        </label>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      </div>
      <Calendar/>

    </div>
    <Footer/>
    </>

  );
};

export default ReservationForm;