const usersService = require('../services/usersService');

async function create(req, res, next) {
  try {
    const user = await usersService.createUser(req.body);

    return res.status(201).json({ message: 'Usuário criado com sucesso!', user: user });
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    await usersService.loginUser(req.body)

    return res.status(200).json({ message: 'E-mail enviado! Verifique sua caixa de entrada para obter o código de acesso.' });
  } catch (error) {
    next(error)
  }
}

async function verify2FA(req, res, next) {
  try {
    await usersService.verify2FAUser(req.body);

    return res.status(200).json({ message: 'Autenticação concluída com sucesso! Bem-vindo(a).' });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
  login,
  verify2FA
};