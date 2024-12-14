const express = require('express');
const router = express.Router();
const paymentController = require('../../Controller/Payment/paymentController.js');

router.post('/api/payment', paymentController.createPaymentCheckout);
router.get('/api/payment', paymentController.get_payments);
router.get('/api/payment/reports', paymentController.get_reports)

module.exports = router;