export const formatDateToWeekday = (date) => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${year}-${month}-${day} ${dayOfWeek}`;
}

export const formatDate = (date) => {
    const year = date.getFullYear(); // Get the full year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    const day = String(date.getDate()).padStart(2, '0'); // Get day of the month
  
    return `${year}-${month}-${day}`;
};

  export const formatDateTime = (date) => {
        // Custom format (MM-DD-YYYY HH:mm:ss)
        const formattedDate = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          
          // Manipulate the string to match the format 'MM-DD-YYYY (hh:mmAM/PM)'
          const finalFormattedDate = formattedDate.replace(',', '').replace(' ', ' (');
          const result = finalFormattedDate + ')';
          return result
  }


  export const formatTime = (time) => {
    let [hours, minutes] = time.split(':');

    // Convert hours to an integer
    hours = parseInt(hours);

    // Determine AM or PM
    let period = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; // If hours are 0, set to 12 (for 12 AM)
    console.log(`${hours}:${minutes} ${period}`)
    // Return the time in standard format
    return `${hours}:${minutes} ${period}`;
  }

  
  export const addTime = (time, timeToAdd) => {
    let [hours, minutes] = time.split(':').map(Number);

    hours = parseInt(hours);
    hours = hours + timeToAdd;
    const updatedTime = `${hours}:${minutes}`

    return formatTime(updatedTime)
  }