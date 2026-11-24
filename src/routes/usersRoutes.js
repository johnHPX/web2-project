const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

// POST - Cadastro
router.post('/register', usersController.create)

// POST - Login
router.post('/login', usersController.login);

// POST - Validar 2FA
router.post('/verify-2fa', usersController.verify2FA);

module.exports = router;