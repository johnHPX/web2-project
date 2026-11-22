const express = require('express');
const cors = require('cors');

const weekdayCheck = require('./middlewares/diaUtil');
const requestLogger = require('./middlewares/requisicoesLogger');
const errorHandler = require('./middlewares/errorHandler');


const moviesRoutes = require('./routes/moviesRoutes');
const logsRoutes = require('./routes/logsRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(weekdayCheck);

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'Claquete API está funcionando!' });
});

// Rotas da API
app.use('/movies', moviesRoutes);
app.use('/logs', logsRoutes);
app.use('/users', usersRoutes);

// Middleware global de errors
app.use(errorHandler);

module.exports = app;
