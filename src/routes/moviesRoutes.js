const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
let movies = require('../data/moviesData');

router.get('/', (req, res) => {
  res.json(movies);
});

router.get('/pdf', (req, res) => {
  const doc = new PDFDocument({ margin: 30 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=claquete_catalogo.pdf');

  doc.pipe(res);

  doc.fontSize(20).text('Claquete API - Catálogo', { align: 'center' });
  doc.moveDown();

  movies.forEach(m => {
    const listaGeneros = Array.isArray(m.generos) ? m.generos.join(', ') : m.generos;
    doc.fontSize(14).text(`[${m.id}] ${m.titulo} (${m.ano}) - Nota: ${m.nota}`);
    doc.fontSize(10).text(`Gênero(s): ${listaGeneros} | Duração: ${m.duracao} | Idioma: ${m.idioma}`);
    doc.fontSize(10).text(`Diretor: ${m.diretor}`);
    doc.fontSize(10).text(`Sinopse: ${m.sinopse}`);
    doc.moveDown(1.5);
  });

  doc.end();
});

router.get('/:id', (req, res) => {
  const id = req.params.id; // Removido o parseInt
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: "Item não encontrado." });
  }
  res.json(movie);
});

router.post('/', (req, res) => {
  const { titulo, ano, nota, sinopse, duracao, generos, diretor, idioma } = req.body;

  const lastItem = movies[movies.length - 1];
  const lastNum = lastItem ? parseInt(lastItem.id.replace('mov', '')) : 0;
  const nextId = `mov${String(lastNum + 1).padStart(4, '0')}`;

  const novoItem = {
    id: nextId,
    titulo,
    ano,
    nota,
    sinopse,
    duracao,
    generos: Array.isArray(generos) ? generos : [generos],
    diretor,
    idioma
  };

  movies.push(novoItem);
  res.status(201).json(novoItem);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = movies.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Item não encontrado." });
  }

  movies.splice(index, 1);
  res.json({ message: "Item excluído com sucesso." });
});

module.exports = router;