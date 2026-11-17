const logsService = require('../services/logsService');
const pendingLogs = new Set();

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

  res.on('finish', () => {
    const log = {
      data,
      horario,
      metodo: req.method,
      rota: req.originalUrl,
      statusCode: res.statusCode,
      duracao: Date.now() - inicio
    };

    const logPromise = logsService.createLog(log)
      .catch(error => {
        console.error('Erro ao registrar requisição:', error);
      })
      .finally(() => {
        pendingLogs.delete(logPromise);
      });

    pendingLogs.add(logPromise);
  });

  next();
};

// Aguarda todas as operações de registro pendentes.
module.exports.waitForPendingLogs = async () => {
  await Promise.all([...pendingLogs]);
};
