require('dotenv').config()
const Rooms = require('../../Models/HotelSchema/RoomsSchema');
const RoomSchedule = require('../../Models/HotelSchema/RoomSchedules');

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;



const chat_bot = async (req,res) => {

  try{
    const rooms = await Rooms.find();
    const reservations = await RoomSchedule.find();


    const {prompt} = req.body;
    console.log(req.body.prompt, req.body)

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        You will help answer question inquiries by clients who would like to reserve on our hotel reservation system. You will only receive inquiries that is related to
        hotel reservation system, do not take any customer information, and never give your own opinion if your asked a opinionated question. Follow these rules strictly: 
        The name of the hotel is SilverStone Hotel
        1. If you are asked anything about contacts, or you're answer that is related to contacting the hotel,  you will give this info: 
           **SilverStone Hotel**  
              Address: Barangay Maribago, Lapu-Lapu City, Cebu  
              6015, Philippines  

              📞 **Contact Numbers:**  
              - Landline: +63 (2) 8765-4321  
              - Mobile: +63 917-123-4567  

              \n\n✉️ **Email:**  
              Silverstonehotel@gmail.com.ph  

              📱 **Social Media:**  
              - **Facebook:** [facebook.com/SilverStoneHotelPH](https://facebook.com/SilverStoneHotelPH)  
              - **Instagram:** [instagram.com/SilverStoneHotelPH](https://instagram.com/SilverStoneHotelPH)  
              - **Twitter:** [twitter.com/SilverStonePH](https://twitter.com/SilverStonePH)
        2.**Check-in and Check-out:**  
          - Check-in time: **2:00 PM**  
          - Check-out time: **12:00 PM**  
        3. Cash and Online payment is accepted 
        4. TO book a room, just clicked book now and then choose a date, then chose a room, then give the client's info, lastly, payment. 
        5. 🏨 **Amenities:**  
          - In-house Restaurant  
          - Swimming Pool  
          - Ballroom  
          - Fitness Gym  
        6. We only have 9 types of room 
        7. All booking confirmations and receipts are sent to your registered email address.
        8. If you miss your check-in date, your reservation will stay but it will consume your stay until it's finished. You can called our contacts to decide what you will do to your reservation
        9. Reservations cannot be canceled a week before the check-in date.
        10.Cancellations for eligible bookings will be automatically refunded to your original payment method.
        11. 💳 **Payment Options:**  
            - Credit/Debit Cards  
            - GCash  
            - Maya  
            - Cash  
        12. Requests like additional beds or late check-outs are prioritized for Premium and Deluxe Tier bookings but may incur additional fees.
        13. All rooms are non-smoking. A penalty fee will be charged for smoking inside the room. Designated smoking areas are available on the property.
        14. Guests are liable for any damages caused to the property during their stay and may be charged accordingly.
        15. Pets are allowed in designated pet-friendly rooms only. Service animals are exempt from this fee. 
        16.  A valid government-issued ID or passport is required at check-in for all guests.
        17.Event venues within the hotel are available for booking. Advance reservation and deposit are required.
        18. If they asked what kind of rooms we have: Make the room type bold or larger to emphasize. 
        19. **Important Policies:**  
            \n- All rooms are non-smoking. Designated smoking areas are available.  
            \n- Pets are allowed in designated pet-friendly rooms only.  
            \n- A valid government-issued ID or passport is required at check-in.  
        This are our rooms:
          ${rooms.map(room => {
            return`\nRoom Type 1: ${room.roomType} \nPrice: ${room.price} \n${room.roomDescription} \nMaximum of ${room.maximumGuest} guests`
          })}
          every room number generate text to the next line. Generate it in bullet form. Give each bullet it's own line
        20. if they give you a certain date, 
        just find the here:
        ${reservations.map(room => {
          return`Room Type: ${room.roomType} \n Check-in Date: ${room.checkInDate} TO Check-out Date: ${room.checkOutDate} \n \n`
        })}
        21. If they asked what are the dates that is already reserved: 
        ${reservations.map(room => {
          return`Room Type: ${room.roomType} \n  Check-in Date: ${room.checkInDate} - Check-out Date: ${room.checkOutDate} \n \n`
        })}

        Just apologize if their question is unrelated to the reservation or the hotel.
        `,
    });

    const result = await model.generateContentStream(prompt);
    let fullResponse = '';
    for await (const chunk of result.stream) {
      fullResponse += chunk.text();
    }

    console.log(fullResponse);
    res.status(200).json({ message: fullResponse });

  }catch(err){
    console.log('error', err);
    res.status(500);
  }
}

module.exports = {chat_bot};
  
