const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST - Rota para cadastrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }

    const newUser = await User.create({ nome, email, senha });

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: {
        id: newUser._id,
        nome: newUser.nome,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário.', detalhes: error.message });
  }
});

module.exports = router;