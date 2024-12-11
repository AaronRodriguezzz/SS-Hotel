import React, { useEffect, useState } from 'react';
import { format, startOfMonth, getDaysInMonth, startOfWeek, addDays, isSameDay } from 'date-fns';
import './Calendar.css';  // Make sure you style it in this file

const Calendar = () => {
  // State to manage the current date and the selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());  // Default selected date is today's date
  // Function to go to the previous month

  useEffect(() => {
    const fetchOccupiedDate = async () => {
      try{
        const response = await fetch('/api/get')
      }catch(err){

      }
    }

    fetchOccupiedDate();
  })
  const prevMonth = () => {
    setCurrentDate(prev => addDays(prev, -30));  // Go back 30 days (approx 1 month)
  };

  // Function to go to the next month
  const nextMonth = () => {
    setCurrentDate(prev => addDays(prev, 30));  // Go forward 30 days (approx 1 month)
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

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}> ← </button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>  {/* Display current month and year */}
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        {/* Render the weekdays */}
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Render each day in the grid */}
        <div className="days">
          {allDays.map((day, index) => {
            // Get day number
            const dayNumber = format(day, 'd');
            // Check if the day is part of the current month
            const isInMonth = day.getMonth() === currentDate.getMonth();
            return (
              <div
                key={index}
                className={`day ${isInMonth ? '' : 'inactive'} ${isSelected(day) ? 'selected' : ''}`}
                onClick={() => isInMonth && setSelectedDate(day)}  /* Set the selected date */
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

export default Calendar;
