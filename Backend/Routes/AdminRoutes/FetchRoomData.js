const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/FetchRoomData');

router.get('/roomdata', AdminFetch.fetchRoom);
router.get('/reservations', AdminFetch.fetchSchedule);
router.get('/roomnum', AdminFetch.fetchRoomNum);

module.exports = router;
