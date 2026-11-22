const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/moviesController');

const upload = require('../middlewares/upload');

// Listar filmes
router.get('/', moviesController.getAll);

// Gerar catálogo PDF
router.get('/pdf', moviesController.generatePDF);

// Exportar filmes em CSV
router.get('/export', moviesController.exportMovies);

// Cadastrar filme
router.post('/', upload.single('imagemCapa'), moviesController.create);

// Buscar filme por ID
router.get('/:id', moviesController.getById);

// Excluir filme
router.delete('/:id', moviesController.remove);

module.exports = router;