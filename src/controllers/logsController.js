
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

    // Validação da quantidade solicitada.
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

    // Colunas que serão exportadas.
    const headers = [
      '_id',
      'data',
      'horario',
      'metodo',
      'rota',
      'statusCode',
      'duracao'
    ];

    // Escapa os valores para evitar problemas na estrutura do CSV
    // e neutraliza fórmulas em planilhas.
    function escapeCSV(value) {
      let text = String(value ?? '');

      if (/^[\s]*[=+\-@]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    }

    const linhas = [
      headers.map(escapeCSV).join(';')
    ];

    for (const log of logs) {
      const valores = [
        log._id.toString(),
        log.data,
        log.horario,
        log.metodo,
        log.rota,
        log.statusCode,
        log.duracao
      ];

      linhas.push(valores.map(escapeCSV).join(';'));
    }

    const csv = '\uFEFF' + linhas.join('\r\n');

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
