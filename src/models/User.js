const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

// Versão moderna usando apenas async/await, sem o parâmetro 'next'
userSchema.pre('save', async function() {
  // Se a senha não foi modificada ou criada agora, encerra a função e segue o fluxo
  if (!this.isModified('senha')) return;

  // Cria o sal e embaralha a senha
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('User', userSchema, 'usuarios');