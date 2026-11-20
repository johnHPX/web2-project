const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Avaliacao = require('../models/Avaliacao');
const { Parser } = require('json2csv');
const upload = require('../middlewares/upload');

// GET - Listar todos os filmes do banco
router.get('/', async (req, res) => {
  try {
    const movies = await Avaliacao.find(); // Busca no Atlas
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filmes.' });
  }
});

// GET - Gerar PDF com os filmes do banco
router.get('/pdf', async (req, res) => {
  try {
    const movies = await Avaliacao.find(); 
    
    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));
    
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=claquete_catalogo.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);

      return res.status(200).send(pdfBuffer);
    });

    doc.fontSize(20).text('Claquete API - Catálogo', { align: 'center' });
    doc.moveDown();

    movies.forEach(m => {
      const listaGeneros = Array.isArray(m.generos) ? m.generos.join(', ') : m.generos;
      // Usamos m._id porque o MongoDB gera os IDs com underline na frente
      doc.fontSize(14).text(`[${m._id}] ${m.titulo} (${m.ano}) - Nota: ${m.nota}`);
      doc.fontSize(10).text(`Gênero(s): ${listaGeneros} | Duração: ${m.duracao} | Idioma: ${m.idioma}`);
      doc.fontSize(10).text(`Diretor: ${m.diretor}`);
      doc.fontSize(10).text(`Sinopse: ${m.sinopse}`);
      doc.moveDown(1.5);
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ error: 'Erro interno ao gerar o PDF.' });
  }
});

// GET - Exportar dados para CSV
router.get('/exportar/csv', async (req, res) => {
  try {
    const movies = await Avaliacao.find().lean(); 

    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: 'Nenhum filme encontrado para exportar.' });
    }

    const campos = ['_id', 'titulo', 'ano', 'nota', 'diretor', 'idioma', 'sinopse'];
    
    // Converte os dados
    const json2csvParser = new Parser({ fields: campos });
    const csv = json2csvParser.parse(movies);

    // Configura os cabeçalhos para forçar o download do arquivo
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=catalogo_filmes.csv');

    // Envia o arquivo
    res.status(200).send(csv);
  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    res.status(500).json({ error: 'Erro interno ao gerar o CSV.' });
  }
});

// GET - Buscar um filme específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Avaliacao.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Item não encontrado." });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o filme. ID inválido." });
  }
});

// POST - Criar um novo filme no banco
router.post('/', upload.single('imagemCapa'), async (req, res) => {
  try {
    // Se o usuário enviou uma imagem, pegamos a URL que o Cloudinary gerou
    const urlImagem = req.file ? req.file.path : '';

    // Criamos o novo filme juntando os textos e o link da imagem
    const novoItem = await Avaliacao.create({
      ...req.body,
      imagemCapa: urlImagem
    });

    res.status(201).json(novoItem);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar filme.', detalhes: error.message });
  }
});

// DELETE - Excluir um filme do banco
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Avaliacao.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    res.json({ message: "Item excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir item." });
  }
});

module.exports = router;