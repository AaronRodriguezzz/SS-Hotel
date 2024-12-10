const express = require('express');
const router = express.Router();
const AdminLogin = require('../../Controller/Admin/AdminLoginController');

router.post('/api/login', AdminLogin.adminLogin);
router.post('/api/logout', AdminLogin.deleteToken);
router.get('/api/protection', AdminLogin.getToken);
router.get('/api/check-clearance', AdminLogin.check_clearance);


module.exports = router;