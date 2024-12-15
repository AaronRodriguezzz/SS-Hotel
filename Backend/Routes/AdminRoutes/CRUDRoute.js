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
router.put('/api/reservation/due', AdminCrud.handle_due_reservations);
router.put('/api/forget-password', AdminCrud.forgetPassword);
router.get('/api/reset-password/:email', AdminCrud.reset_password);
router.delete('/api/delete/restaurant_reservation/:id', AdminCrud.delete_restaurant_reservation);

module.exports = router;
