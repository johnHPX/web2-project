const express = require('express');
const cors = require('cors');

const weekdayCheck = require('./middlewares/diaUtil');
const requestLogger = require('./middlewares/requisicoesLogger');

const moviesRoutes = require('./routes/moviesRoutes');
const logsRoutes = require('./routes/logsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(weekdayCheck);
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ message: 'Claquete API está funcionando!' });
});

app.use('/movies', moviesRoutes);
app.use('/logs', logsRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Claquete API rodando na porta ${PORT}`);
  });
}

module.exports = app;