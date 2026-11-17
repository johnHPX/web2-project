function escapeCSV(value, delimiter) {
  if (value === null || value === undefined) {
    value = '';
  }

  // Converte arrays em texto.
  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  let text = String(value);

  // Evita que planilhas interpretem valores como fórmulas.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  // Escapa aspas duplas.
  text = text.replace(/"/g, '""');

  return `"${text}"`;
}

function generateCSV(data, columns, options = {}) {
  const delimiter = options.delimiter || ';';
  const includeBOM = options.includeBOM !== false;

  // Gera o cabeçalho.
  const headers = columns
    .map(column => escapeCSV(column.label, delimiter))
    .join(delimiter);

  // Gera as linhas de dados.
  const rows = data.map(item => {
    return columns.map(column => {
      let value = item[column.key];

      // Permite personalizar a formatação de uma coluna.
      if (column.format) {
        value = column.format(value, item);
      }

      return escapeCSV(value, delimiter);
    }).join(delimiter);
  });

  const csv = [headers, ...rows].join('\r\n');

  return includeBOM ? '\uFEFF' + csv : csv;
}

module.exports = {
  generateCSV
};
