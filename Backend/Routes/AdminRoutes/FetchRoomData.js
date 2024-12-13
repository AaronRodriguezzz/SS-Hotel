const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/FetchRoomData');

router.get('/api/roomdata', AdminFetch.fetchRoom);
router.get('/api/reservations', AdminFetch.fetchSchedule);
router.get('/api/roomnum', AdminFetch.fetchRoomNum);
router.get('/api/roomsAvailable/:roomType', AdminFetch.fetchAvailableRooms);
router.get('/api/room_details/:room', AdminFetch.specific_room_schedule);
router.get('/api/walkIn_search/:room', AdminFetch.Available_Search_WalkIn);
router.get('/api/roomnum/available', AdminFetch.handle_available_roomNum);
router.get('/api/restaurant/reservations', AdminFetch.get_restaurant_reservation);

module.exports = router;
