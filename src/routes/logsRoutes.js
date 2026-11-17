const express = require('express');
const router = express.Router();

const logsController = require('../controllers/logsController');

router.get('/export', logsController.exportLogs);
router.get('/', logsController.getLogs);

module.exports = router;
