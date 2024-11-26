const express = require('express');
const router = express.Router();
const AdminFetch = require('../../Controller/Admin/SuperAdminFetch');

router.get('/history', AdminFetch.fetchHistory);

module.exports = router;
