const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/FetchRoomData');

router.get('/roomdata', AdminFetch.fetchRoom);
router.get('/reservations', AdminFetch.fetchSchedule);
router.get('/roomnum', AdminFetch.fetchRoomNum);
router.get('/roomsAvailable/:roomType', AdminFetch.fetchAvailableRooms);
router.get('/room_details/:room', AdminFetch.specific_room_schedule);
router.get('/walkIn_search/:room', AdminFetch.Available_Search_WalkIn);
router.get('/roomnum/available', AdminFetch.handle_available_roomNum);

module.exports = router;
