
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

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'Claquete API está funcionando!' });
});

// Rotas da API
app.use('/movies', moviesRoutes);
app.use('/logs', logsRoutes);

module.exports = app;
