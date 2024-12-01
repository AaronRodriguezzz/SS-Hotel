const express = require('express');
const router = express.Router();
const paymentController = require('../../Controller/Payment/paymentController.js');

router.post('/api/payment', paymentController.createPaymentCheckout);

module.exports = router;