const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  ano: { type: Number, required: true },
  nota: { type: Number, required: true },
  sinopse: { type: String },
  duracao: { type: String },
  generos: [{ type: String }],
  diretor: { type: String },
  idioma: { type: String },
  imagemCapa: { type: String }
});

module.exports = mongoose.model('Avaliacao', avaliacaoSchema, 'avaliacoes');