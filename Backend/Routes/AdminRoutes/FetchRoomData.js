const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/FetchRoomData');

router.get('/get/roomdata', AdminFetch.fetchRoom);
router.get('/get/reservations', AdminFetch.fetchSchedule);

module.exports = router;
