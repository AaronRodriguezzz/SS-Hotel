import React, { useEffect, useState } from 'react';
import { format, startOfMonth, getDaysInMonth, startOfWeek, addDays, isSameDay } from 'date-fns';
import './RestaurantCalendar.css';  // Make sure you style it in this file
import { formatTime } from '../utils/dateUtils'
const Calendar = ({ dateSelected, selectedTime }) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fullyBookedDate, setFullbookedDate] = useState([]);
  const [dateData, setdateData] = useState([]);

  // Utility to check if a day is in the occupied dates
  const isOccupied = (day) => {
    return fullyBookedDate.some((occupiedDate) => 
      isSameDay(new Date(occupiedDate.date), day)
    );
  };

  const addHours = (time, hours) => {
    const endTime = new Date(`1970-01-01T${String(time)}:00`); // Treat the stored time as a start time
    endTime.setHours(endTime.getHours() + hours); // Add the specified number of hours
    return endTime;
  }

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

  // Check if a day is selected /api/specific/:date
  const isSelected = (day) => isSameDay(day, selectedDate);

  useEffect(() => {
    console.log(dateSelected);

    const fetch_specific_date = async () => {    
        try{
            const response = await fetch(`/api/specific/${dateSelected}`);
            const data = await response.json();

            if(response.ok){
              setdateData(data.data);
              console.log(data.time);
            }
     
        }catch(err){
            console.log(err);
        }
    }

    fetch_specific_date()
  },[dateSelected]);

  useEffect(() => {

    const fetchFullBookedDate = async () => {    
        try{
            const response = await fetch('/api/get/fullyBooked');
            const data = await response.json();

            if(response.ok){
              setFullbookedDate(data.filteredDates);
              
            }
    
        }catch(err){
            console.log(err);
        }
    }

    fetchFullBookedDate()
  },[]);


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
            let isHighlighted
            
            if(dateSelected !== ""){
              const selectDate = new Date(dateSelected);
              selectDate.setDate(selectDate.getDate() - 1);
              isHighlighted = selectDate.toISOString().split('T')[0] === new Date(day).toISOString().split('T')[0];
            }
            

            return (
              <div
                key={index}
                className={`day ${isInMonth ? '' : 'inactive'} ${isHighlighted ? 'highlited' : ''} 
                ${isSelected(day) ? 'selected' : ''} `}
                onClick={() => isInMonth && setSelectedDate(day)}
              >
                <span>{dayNumber}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="date-info-container">
        <h2>Unavailable Time</h2>
        {dateData && dateData.map(date => {
          return(
            <div className='sched-container'>
              <p>Time: {formatTime(date.time)}</p>
              <p> | </p>
              <p>Guest Quantity: {date.guestQuantity}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
};


export default Calendar