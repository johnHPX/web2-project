const logs = require('../data/logsData');

module.exports = (req, res, next) => {
  const now = new Date();
  const dataFormatada = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaFormatada = now.toTimeString().split(' ')[0]; // HH:MM:SS

  logs.push({
    data: dataFormatada,
    horario: horaFormatada,
    metodo: req.method,
    rota: req.originalUrl
  });

  next();
};