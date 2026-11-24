const { generateCSV } = require('../utils/csvGenerator');
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


async function exportLogs(req, res) {
  try {
    const quantidade = Number(req.query.quantidade);

    if (
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 10000
    ) {
      return res.status(400).json({
        error: 'Informe uma quantidade inteira entre 1 e 10000.'
      });
    }

    const logs = await logsService.getLatestLogs(quantidade);

    const columns = [
      { key: '_id', label: 'ID' },
      { key: 'data', label: 'Data' },
      { key: 'horario', label: 'Horário' },
      { key: 'metodo', label: 'Método HTTP' },
      { key: 'rota', label: 'Rota' },
      { key: 'statusCode', label: 'Código HTTP' },
      { key: 'duracao', label: 'Duração (ms)' }
    ];

    const csv = generateCSV(logs, columns);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="claquete_logs.csv"'
    );

    return res.status(200).send(csv);

  } catch (error) {
    console.error('Erro ao exportar logs:', error);

    return res.status(500).json({
      error: 'Erro interno ao exportar os logs.'
    });
  }
}


module.exports = {
  getLogs,
  exportLogs
};
