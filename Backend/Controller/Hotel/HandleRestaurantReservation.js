const { restart } = require('nodemon');
const Restaurant = require('../../Models/HotelSchema/RestaurantReservation');

const handle_Available_guest = async (req, res) => {
    const { date, time } = req.body;

    try {
        // Convert input time to Date objects
        const newStartTime = new Date(`1970-01-01T${time}:00`);  // Use the input time string to create the start time
        const newEndTime = new Date(`1970-01-01T${time}:00`);  // Same for end time
        newEndTime.setHours(newEndTime.getHours() + 3);  // Add 3 hours to the end time

        // Find the available reservations for the given date
        const available = await Restaurant.find({ date: new Date(date) });


        const overlap = available.filter((avail) => {

            // Convert stored reservation time to Date object
            const oldStartTime = new Date(`1970-01-01T${String(avail.time)}:00`); // Treat the stored time as a start time
            const oldEndTime = new Date(`1970-01-01T${String(avail.time)}:00`); // Same for end time
            oldEndTime.setHours(oldEndTime.getHours() + 3);  // Add 3 hours to the reservation end time
            
            // Check for overlap: new reservation's time must overlap with an existing one
            return (newStartTime < oldEndTime && newEndTime > oldStartTime);  // Correct comparison for overlap
        });


        let unavailable = 0;
        for (let i = 0; i < overlap.length; i++) {
            unavailable += overlap[i].guestQuantity;
        }

        res.status(200).json({ availableSlot: 40 - unavailable });

    } catch (err) {
        console.log('handle search restaurant', err);
        res.status(500).json({ message: 'Error handling the request' });
    }
};


const handle_reservation_submit = async (req,res) => {

    
    try{
        const {name, email, phoneNumber, date,time, guestsQuantity} = req.body

        console.log('object' , req.body);

        const dataSaved = new Restaurant({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            date: new Date(date),
            time: time,
            guestQuantity: Number(guestsQuantity),
        })

        await dataSaved.save(); 

        return res.status(201).json({message: 'Reservation Successful'})
    }catch(err){
        console.log('Saving reservation ' , err);
    }
}


const get_fully_booked = async (req, res) => { //for the calendar function
    try{
        const dates = await Restaurant.find();
        for(let i=0;i<dates.length;i++){
            for(let q=i+1; q<dates.length; q++){
                if(dates[i] === dates[q]){
                    dates[i].guestQuantity += dates[q].guestQuantity;
                }
            }
        }

        const filteredDates = dates.filter((date,index) => {
            return(date.guestQuantity === 40)
        })

        return res.status(200).send({filteredDates});


    }catch(err){
        console.log('Saving reservation ' , err);
    }
}

const check_certain_date = async (req,res) => {
    try{
        const { dateSelected } = req.params;
        console.log(req.params);
        const data = await Restaurant.find({date: new Date(dateSelected)})

        console.log('reservation data' , data);

        if(!data){
            return res.status(404).json({message: 'Error at finding restaraunt reservation'})
        }

        console.log('resto' , data);

        res.status(201).json({data})    
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})
    }
}

module.exports = {
    handle_Available_guest,
    handle_reservation_submit,
    get_fully_booked,
    check_certain_date
}