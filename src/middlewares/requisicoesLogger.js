const logsService = require('../services/logsService');

module.exports = (req, res, next) => {
  const inicio = Date.now();
  const now = new Date();

  const data = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  const horario = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join(':');

  res.on('finish', async () => {
    const log = {
      data,
      horario,
      metodo: req.method,
      rota: req.originalUrl,
      statusCode: res.statusCode,
      duracao: Date.now() - inicio
    };

    try {
      await logsService.createLog(log);
    } catch (error) {
      console.error('Erro ao registrar requisição:', error);
    }
  });

  next();
};
