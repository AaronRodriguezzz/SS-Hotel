const express = require('express');
const router = express.Router();
const AdminLogin = require('../../Controller/Admin/AdminLoginController');

router.post('/login', AdminLogin.adminLogin);
router.post('/logout', AdminLogin.deleteToken);
router.get('/protection', AdminLogin.getToken);
router.get('/check-clearance/:employeeEmail', AdminLogin.check_clearance);


module.exports = router;