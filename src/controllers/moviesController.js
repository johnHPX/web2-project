const PDFDocument = require('pdfkit');
const moviesService = require('../services/moviesService');
const { generateCSV } = require('../utils/csvGenerator');

function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

async function getAll(req, res) {
  try {
    const movies = await moviesService.getAllMovies();

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Erro ao listar filmes:', error);

    return res.status(500).json({
      error: 'Erro interno ao listar filmes.'
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ID do filme inválido.'
      });
    }

    const movie = await moviesService.getMovieById(id);

    if (!movie) {
      return res.status(404).json({
        error: 'Item não encontrado.'
      });
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.error('Erro ao buscar filme:', error);

    return res.status(500).json({
      error: 'Erro interno ao buscar filme.'
    });
  }
}

async function create(req, res) {
  try {
    const urlImagem = req.file ? req.file.path : '';

    const movie = await moviesService.createMovie(req.body, urlImagem);

    return res.status(201).json(movie);
  } catch (error) {
    console.error('Erro ao cadastrar filme:', error);

    return res.status(500).json({
      error: 'Erro interno ao cadastrar filme.'
    });
  }
}


async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: 'ID do filme inválido.'
      });
    }

    const deleted = await moviesService.deleteMovie(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Item não encontrado.'
      });
    }

    return res.status(200).json({
      message: 'Item excluído com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao excluir filme:', error);

    return res.status(500).json({
      error: 'Erro interno ao excluir filme.'
    });
  }
}


async function generatePDF(req, res) {
  try {
    const movies = await moviesService.getAllMovies();

    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));

    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=claquete_catalogo.pdf'
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      return res.status(200).send(pdfBuffer);
    });

    doc.fontSize(20).text('Claquete API - Catálogo', {
      align: 'center'
    });

    doc.moveDown();

    movies.forEach(m => {
      const listaGeneros = Array.isArray(m.generos)
        ? m.generos.join(', ')
        : m.generos;

      doc.fontSize(14).text(
        `[${m._id}] ${m.titulo} (${m.ano}) - Nota: ${m.nota}`
      );

      doc.fontSize(10).text(
        `Gênero(s): ${listaGeneros} | Duração: ${m.duracao} | Idioma: ${m.idioma}`
      );

      doc.fontSize(10).text(`Diretor: ${m.diretor}`);
      doc.fontSize(10).text(`Sinopse: ${m.sinopse}`);

      doc.moveDown(1.5);
    });

    doc.end();

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);

    return res.status(500).json({
      error: 'Erro interno ao gerar o PDF.'
    });
  }
}


async function exportMovies(req, res) {
  try {
    // Recupera todos os filmes do MongoDB.
    const movies = await moviesService.getAllMovies();

    const columns = [
      { key: '_id', label: 'ID' },
      { key: 'titulo', label: 'Título' },
      { key: 'ano', label: 'Ano' },
      { key: 'nota', label: 'Nota' },
      { key: 'sinopse', label: 'Sinopse' },
      { key: 'duracao', label: 'Duração' },
      {
        key: 'generos',
        label: 'Gêneros',
        format: value => Array.isArray(value)
          ? value.join(', ')
          : value
      },
      { key: 'diretor', label: 'Diretor' },
      { key: 'idioma', label: 'Idioma' }
    ];

    const csv = generateCSV(movies, columns);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="claquete_filmes.csv"'
    );

    return res.status(200).send(csv);

  } catch (error) {
    console.error('Erro ao exportar filmes:', error);

    return res.status(500).json({
      error: 'Erro interno ao exportar os filmes.'
    });
  }
}


module.exports = {
  getAll,
  getById,
  create,
  remove,
  generatePDF,
  exportMovies
};