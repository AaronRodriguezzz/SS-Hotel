const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/SuperAdminFetch');

router.get('/api/history', AdminFetch.fetchHistory);
router.get('/api/admin-account', AdminFetch.fetchAdmin);

module.exports = router;
