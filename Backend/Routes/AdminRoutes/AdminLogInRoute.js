const express = require('express');
const router = express.Router();
const AdminlogIn = require('../../Controller/Admin/AdminLoginController');

router.post('/login', AdminlogIn.adminLogIn);

module.exports = router;