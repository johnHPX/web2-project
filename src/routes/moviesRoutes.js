const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/moviesController');

// Listar filmes
router.get('/', moviesController.getAll);

// Gerar catálogo PDF
router.get('/pdf', moviesController.generatePDF);

// Buscar filme por ID
router.get('/:id', moviesController.getById);

// Cadastrar filme
router.post('/', moviesController.create);

// Excluir filme
router.delete('/:id', moviesController.remove);

module.exports = router;