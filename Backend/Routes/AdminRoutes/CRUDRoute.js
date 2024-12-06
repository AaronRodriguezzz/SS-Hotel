const express = require('express');
const router = express.Router();
const AdminCrud = require('../../Controller/Admin/CRUDController');

router.post('/new-admin', AdminCrud.addAdmin);
router.post('/assignRoom', AdminCrud.processReservation);


module.exports = router;
