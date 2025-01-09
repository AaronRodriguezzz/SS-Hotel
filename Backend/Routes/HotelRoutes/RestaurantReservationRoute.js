const express = require('express');
const router = express.Router();
const Restaurant = require('../../Controller/Hotel/HandleRestaurantReservation');

router.post('/api/restaurant/availableSearch', Restaurant.handle_Available_guest);
router.get('/api/submit/restaurantReservation', Restaurant.handle_reservation_submit);
router.get('/api/get/fullyBooked', Restaurant.get_fully_booked);
router.get('/api/specific/:dateSelected', Restaurant.check_certain_date);

module.exports = router;