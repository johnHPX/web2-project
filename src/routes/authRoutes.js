const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST - Cadastro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'E-mail já em uso.' });

    const newUser = await User.create({ nome, email, senha });
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: { id: newUser._id, nome: newUser.nome, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Busca o usuário
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Compara a senha digitada com a criptografada no banco
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta.' });

    // Gera um código de 6 dígitos aleatórios
    const codigo = crypto.randomInt(100000, 999999).toString();
    
    // Salva o código e o tempo de expiração no banco
    user.codigo2fa = codigo;
    user.expiracao2fa = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Envia o e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Seu código de acesso - Claquete API',
      text: `Seu código de autenticação é: ${codigo}. Ele expira em 10 minutos.`
    });

    res.json({ message: 'E-mail enviado! Verifique sua caixa de entrada para obter o código de acesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no processo de login.', detalhes: error.message });
  }
});

// POST - Validar 2FA
router.post('/verify-2fa', async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });
    
    // Verifica se o código bate e se não passou do tempo
    if (user.codigo2fa !== codigo || user.expiracao2fa < Date.now()) {
      return res.status(400).json({ error: 'Código inválido ou expirado.' });
    }

    user.codigo2fa = undefined;
    user.expiracao2fa = undefined;
    await user.save();

    res.json({ message: 'Autenticação concluída com sucesso! Bem-vindo(a).' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar o código.' });
  }
});

module.exports = router;