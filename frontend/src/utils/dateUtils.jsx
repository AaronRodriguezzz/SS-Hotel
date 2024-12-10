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