const express = require('express');
const router = express.Router();
const HotelControllers = require('../../Controller/Hotel/ReservationHandling');

router.post('/api/availabilitySearch', HotelControllers.AvailableRoomSearch);
router.get('/api/reserve', HotelControllers.NewReservation);
router.get('/api/send_code/:email', HotelControllers.get_verification_code);


module.exports = router;