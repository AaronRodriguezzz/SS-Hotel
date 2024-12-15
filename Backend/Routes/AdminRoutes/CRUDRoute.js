const express = require('express');
const router = express.Router();
const AdminCrud = require('../../Controller/Admin/CRUDController');
const Admin = require('../../Models/AdminSchemas/AdminSchema');

router.post('/api/new-admin', AdminCrud.addAdmin);
router.post('/api/assignRoom', AdminCrud.processReservation);
router.post('/api/update/adminRole', AdminCrud.updateRole);
router.post('/api/update/adminStatus', AdminCrud.updateStatus);
router.delete('/api/reservation/:id', AdminCrud.processCancellation);
router.put('/api/room/checkout/:roomNum', AdminCrud.processCheckOut);
router.delete('/api/delete_admin/:id', AdminCrud.delete_admin);
router.delete('/api/delete/due_reservation', AdminCrud.delete_due_reservations);

module.exports = router;
