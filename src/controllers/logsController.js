
const logsService = require('../services/logsService');

async function getLogs(req, res) {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({
        error: 'Informe a data no formato YYYY-MM-DD via query string (?data=...).'
      });
    }

    // Valida o formato e a existência da data.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res.status(400).json({
        error: 'Data inválida. Utilize o formato YYYY-MM-DD.'
      });
    }

    const [ano, mes, dia] = data.split('-').map(Number);
    const dataValida = new Date(Date.UTC(ano, mes - 1, dia));

    if (
      dataValida.getUTCFullYear() !== ano ||
      dataValida.getUTCMonth() !== mes - 1 ||
      dataValida.getUTCDate() !== dia
    ) {
      return res.status(400).json({
        error: 'A data informada não existe.'
      });
    }

    const logs = await logsService.getLogsByDate(data);

    return res.status(200).json(logs);

  } catch (error) {
    console.error('Erro ao consultar logs:', error);

    return res.status(500).json({
      error: 'Erro interno ao consultar os logs.'
    });
  }
}

module.exports = {
  getLogs
};
