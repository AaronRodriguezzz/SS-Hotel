const nodemailer = require('nodemailer');

const formatDateTime = (date) => {
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

const sendBookingDetails = async (email, rooms, guest) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(rooms)
    const info = await transporter.sendMail({
      from: "SilverStone Hotel Reservations",
      to: email,
      subject: "Booking(s) Details",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bookings</title>
        </head>
        <body style="margin: 0; padding: 0px; font-family: Arial, sans-serif; background-color: rgba(204, 182, 57,.8);">
        <div style="background-color: white; padding: 20px">  
          <div style="width: 100vw; background-color: #2a4b60; color: white; text-allign: end; padding: 10px; font-weight: 600; font-size: 17px;">
            SilverStone Hotel
          </div>
          <h1>Your SilverStone Hotel Booking(s)</h1>
          <p style="font-size: 17px;">Guest Name: ${guest.guestName}</p>
          <p style="font-size: 17px;">Guest Email: ${email}</p>
          <p style="font-size: 17px;">Guest Contact: ${guest.guestContact}</p>
          <p style="font-size: 17px;">Book Date: ${formatDateTime(new Date())}</p>
          <table width="100%" style="margin: 50px 0 30px 0; background-color: white;">
              <thead>
                <tr>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 15px; font-weight: 400;">Room Type</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 15px; font-weight: 400;">Check-In</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 15px; font-weight: 400;">Check-Out</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 15px; font-weight: 400;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${rooms.map(room => `
                  <tr>
                    <td style="padding: 10px; text-align: center;">${room.roomType}</td>
                    <td style="padding: 10px; text-align: center;">${new Date(room.checkInDate).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; text-align: center;">${new Date(room.checkOutDate).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; text-align: center;">${(room.price * room.daysGap).toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2
                    })}
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
            <h2>Total: ${rooms.reduce((total, room) => room.price * room.daysGap,0).toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            })}</h2>
            </div>
        </body>
        </html>
      `,
    });
  }

  const send_restaurant_reservation_details = async (object) => {

    const {name, email, phoneNumber, date,time, guestsQuantity} = object

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "SilverStone Hotel Reservations",
      to: email,
      subject: "Restaurant Reservation Details",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bookings</title>
        </head>
        <body style="margin: 0; padding: 0px; font-family: Arial, sans-serif; background-color: rgba(204, 182, 57,.8);">
        <div style="background-color: white; padding: 20px">  
          <div style="width: 80vw; background-color: #2a4b60; color: white; text-allign: end; padding: 20px; font-weight: 600; font-size: 23px;">
            SilverStone Hotel
          </div>
          <h1>Your SilverStone Restaurant Booking</h1>
          <p style="font-size: 17px;">Guest Name: ${name}</p>
          <p style="font-size: 17px;">Guest Email: ${email}</p>
          <p style="font-size: 17px;">Guest Contact: ${phoneNumber}</p>
          <p style="font-size: 17px;">Book Date: ${formatDateTime(new Date())}</p>
          <table width="100%" style="margin: 50px 0 30px 0; background-color: white;">
              <thead>
                <tr>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 17px; font-weight: 400;">Guest Name</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 17px; font-weight: 400;">Reservation Date</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 17px; font-weight: 400;">Reservation Time</th>
                  <th style="background-color: #2a4b60; color: rgba(204, 182, 57,.8); padding: 10px; font-size: 17px; font-weight: 400;">Number of Guests</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td style="padding: 10px; font-size: 16px; text-align: center;">${name}</td>
                    <td style="padding: 10px; font-size: 16px; text-align: center;">${new Date(date).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; font-size: 16px; text-align: center;">${time}</td>
                    <td style="padding: 10px; font-size: 16px; text-align: center;">${guestsQuantity}</td>
                  </tr>
              </tbody>
            </table>
            </div>
        </body>
        </html>
      `,
    });
  }


  module.exports = {
    sendBookingDetails,
    send_restaurant_reservation_details
  }