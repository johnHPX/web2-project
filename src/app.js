require("dotenv").config();

const { connectDatabase } = require('./config/database');


const express = require('express');
const cors = require('cors');

const weekdayCheck = require('./middlewares/diaUtil');
const requestLogger = require('./middlewares/requisicoesLogger');

const moviesRoutes = require('./routes/moviesRoutes');
const logsRoutes = require('./routes/logsRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

app.use(weekdayCheck);
app.use(requestLogger);

// Database config

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error);
    next(error);
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'Claquete API está funcionando!' });
});

// Rotas da API
app.use('/movies', moviesRoutes);
app.use('/logs', logsRoutes);

// Tratamento errors database

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Erro interno do servidor.'
  });
});

module.exports = app;
