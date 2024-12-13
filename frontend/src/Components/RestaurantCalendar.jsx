import React, { useEffect, useState } from 'react';
import { format, startOfMonth, getDaysInMonth, startOfWeek, addDays, isSameDay } from 'date-fns';
import './RestaurantCalendar.css';  // Make sure you style it in this file

const Calendar = ({ roomType }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [datesToRender, setDatesToRender] = useState([]);
  // Utility to check if a day is in the occupied dates
  const isOccupied = (day) => {
    return datesToRender.some((occupiedDate) =>
      isSameDay(new Date(occupiedDate), day)
    );
  };

  // Get the first day of the current month
  const firstDayOfMonth = startOfMonth(currentDate);
  
  // Get the number of days in the current month
  const daysInMonth = getDaysInMonth(currentDate);
  
  // Get the first day of the week of the current month
  const startOfWeekInMonth = startOfWeek(firstDayOfMonth);
  
  // Generate all the days in the month including empty days of the previous month
  const days = [];
  for (let i = 0; i < daysInMonth; i++) {
    days.push(addDays(startOfMonth(currentDate), i));  // Add each day to the array
  }

  // Get the days before the first day of the current month to complete the calendar grid
  const startOfWeekBefore = startOfWeekInMonth;
  const totalDaysInGrid = 42; // 6 rows for 7 days each
  const allDays = [];
  
  // Generate the full grid of days (including the previous month's extra days)
  for (let i = 0; i < totalDaysInGrid; i++) {
    allDays.push(addDays(startOfWeekBefore, i));
  }

  // Check if a day is selected
  const isSelected = (day) => isSameDay(day, selectedDate);

  useEffect(() => {
    const fetchReservations = async () => {    
        try{
            const response = await fetch('/api/reservations');
            const data = await response.json();

            if(response.ok){
                setOccupiedDates(data.reservations);
            }
    
        }catch(err){
            console.log(err);
        }
    }
    fetchReservations()
  },[]);

  useEffect(() => {
    setDatesToRender(() => {
      if(occupiedDates){
        const dates = [];
        occupiedDates.map(data => {
          let currentDate = new Date(data.checkInDate);
          let endDate = new Date(data.checkOutDate);
        
          if(roomType !== ''){
            if(roomType === data.roomType){
              while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
              }
            }
          }else{
            while (currentDate <= endDate) {
              dates.push(new Date(currentDate));
              currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
            }
          }
          
        })
  
        return dates;
      }
    });
  },[roomType,occupiedDates])

  return (
    <div className="restaurant-calendar-container">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(addDays(currentDate, -30))}>←</button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(addDays(currentDate, 30))}>→</button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="days">
          {allDays.map((day, index) => {
            const dayNumber = format(day, 'd');
            const isInMonth = day.getMonth() === currentDate.getMonth();
            return (
              <div
                key={index}
                className={`day ${isInMonth ? '' : 'inactive'} ${isOccupied(day) ? 'occupied' : ''} ${
                  isSelected(day) ? 'selected' : ''
                }`}
                onClick={() => isInMonth && setSelectedDate(day)}
              >
                <span>{dayNumber}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default Calendar