const express = require('express');
const router = express.Router();
const RenderRoomController = require('../../Controller/Hotel/RenderRoomsController');

router.get('/api/rooms/:key', RenderRoomController.renderRooms);



module.exports = router;