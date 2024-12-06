const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/SuperAdminFetch');

router.get('/history', AdminFetch.fetchHistory);
router.get('/admin-account', AdminFetch.fetchAdmin);

module.exports = router;
