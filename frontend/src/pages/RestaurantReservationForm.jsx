import React, { useState,useEffect } from "react";
import "./RestaurantReservation.css"; // Create this CSS file for styling
import Calendar from '../Components/RestaurantCalendar'
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import Modal from '../Components/RestaurantModal';
import RestaurantTerms from "../Components/RestaurantTerms";

const ReservationForm = () => {
  const [guestLimit, setGuestLimit] = useState(40);
  const [showOverlay, setShowOverlay] = useState(false);
  const [successMessage, setSuccessMessage]  = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    date: "",
    time: "",
    guestsQuantity: "",
  });

  const handle_view_terms = (e) => {
    e.preventDefault();
    
    if(formData.guestsQuantity > guestLimit){
      return alert(`We’re sorry, but we can only accommodate ${guestLimit} guest in that time`);
    }

    setShowOverlay(true);
  } 

  const handleGmailViewed = () => {
    setSuccessMessage(false);
  }

  const accept_terms = () => {
    setShowOverlay(false)    
    handleSubmit();
  }

  const decline_terms = () => {
    setShowOverlay(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => { 

    try{
      const response = await fetch('/api/submit/restaurantReservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if(response.ok){
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          date: "",
          time: "",
          guestsQuantity: "",
        });

        setSuccessMessage(true);
      }

    }catch(err){
      console.log('frontend submit', err);
    }
  };
  
  useEffect(() => {
    const fetchAvailability = async () => {
      if(formData.date !== "" && formData.time !== ""){
        try{

          const response = await fetch('/api/restaurant/availableSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
  
          if(response.ok){
            const data = await response.json();
            setGuestLimit(data.availableSlot);
          }
    
        }catch(err){
          console.log('useEffect error' , err);
        }
      }
    }

    fetchAvailability();

  },[formData.date, formData.time])


  return (
    <div className="restaurant-reservation">
    <NavBar/>
    <div className="reservation-container">
      <div className="child-reservation-container">
        <h1 className="reservation-title">Restaurant Reservation</h1>
        <form className="reservation-form" onSubmit={handle_view_terms}>
            <input
              type="text"
              name="name"
              placeholder="Reservation Name"
              value={formData.name}
              onChange={handleChange}
              required
            />  
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              minLength={11}
              maxLength={11}
              required
            />
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
            <input
              type="time"
              name="time"
              placeholder="Time"
              value={formData.time}
              onChange={handleChange}
              min="07:00" 
              max="23:00" 
              required
            />
            <input
              type="number"
              name="guestsQuantity"
              placeholder="Guests Number"
              value={formData.guestsQuantity}
              onChange={handleChange}
              min={1}
              required
            />

            <button className="submit-button">SUBMIT</button>
            <button type="button" className="cancel-button" onClick={() => {window.location.href = '/restaurant'}}>CANCEL</button>
        </form>
      </div>

      <Calendar dateSelected={formData.date} selectedTime={formData.time}/>
    </div>
    <Footer/>
    {showOverlay && <RestaurantTerms onAccept={accept_terms} onDecline={decline_terms}/>} 
    {successMessage && <Modal onView={handleGmailViewed}/>}
    </div>
  );
};

export default ReservationForm;