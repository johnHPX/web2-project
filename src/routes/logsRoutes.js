const express = require('express');
const router = express.Router();

const logsController = require('../controllers/logsController');

// Exportar logs em CSV
router.get('/export', logsController.exportLogs);

// Acessar logs por data
router.get('/', logsController.getLogs);

module.exports = router;
