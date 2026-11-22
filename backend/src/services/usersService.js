const bcrypt = require('bcrypt');
const crypto = require('crypto');

const AppError = require('../utils/appErrors');
const usersRep = require('../repositories/usersRep');
const emailUtils = require('../utils/emailUtils')

async function createUser(userData) {
  const senhaHash = await bcrypt.hash(userData.senha, 12);

  const user = {
    nome: userData.nome,
    email: userData.email.trim().toLowerCase(),
    senha: senhaHash,
    codigo2fa: undefined,
    expiracao2fa: undefined
  }

  const userExists = await usersRep.findOne(user.email);

  if (userExists) {
    throw new AppError("E-mail já em uso.", 409, 1001)
  }

  return await usersRep.create(user);
}

async function loginUser(userData) {
  const userRequest = {
    email: userData.email,
    senha: userData.senha
  }

  const userExists = await usersRep.findOne(userRequest.email);

  if (!userExists) {
    throw new AppError("Usuário não encontrado.", 404, 1002)
  }

  const senhaValida = await bcrypt.compare(userRequest.senha, userExists.senha);

  if (!senhaValida) {
    throw new AppError("Senha incorreta.", 401, 1003)
  }

  const codigo = crypto.randomInt(100000, 999999).toString();

  const resultUpdate = await usersRep.update(userExists._id.toString(), {
    codigo2fa: codigo,
    expiracao2fa: Date.now() + 10 * 60 * 1000
  })

  if (!resultUpdate) {
    throw new AppError("Erro ao atualizar usuario", 409, 1004)
  }

  return await emailUtils.sendEmail(userExists.email, codigo);
}

async function verify2FAUser(userData) {
  const userRequets = {
    email: userData.email,
    codigo: userData.codigo
  };

  const userExists = await usersRep.findOne(userRequets.email);

  if (!userExists) {
    throw new AppError("Usuário não encontrado.", 404, 1005)
  }

  if (!userExists.codigo2fa ||
    !userExists.expiracao2fa || userExists.codigo2fa !== userRequets.codigo || userExists.expiracao2fa < Date.now()) {
    throw new AppError("Código inválido ou expirado.", 400, 1006)
  }

  const resultUpdate = await usersRep.update(userExists._id.toString(), {
    codigo2fa: undefined,
    expiracao2fa: undefined
  })

  if (!resultUpdate) {
    throw new AppError("Erro ao atualizar usuario", 409, 1007)
  }

  return;
}

module.exports = {
  createUser,
  loginUser,
  verify2FAUser
};