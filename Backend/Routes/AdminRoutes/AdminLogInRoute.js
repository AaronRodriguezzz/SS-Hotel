const express = require('express');
const router = express.Router();
const AdminLogin = require('../../Controller/Admin/AdminLoginController');

router.post('/login', AdminLogin.adminLogin);
router.get('/protection', AdminLogin.getToken);


module.exports = router;