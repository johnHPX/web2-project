require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const weekdayCheck = require('./middlewares/diaUtil');
const requestLogger = require('./middlewares/requisicoesLogger');

const moviesRoutes = require('./routes/moviesRoutes');
const logsRoutes = require('./routes/logsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao Banco: claquete!'))
  .catch((err) => console.error('Erro ao conectar ao Banco:', err));

app.use(weekdayCheck);
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ message: 'Claquete API está funcionando!' });
});

app.use('/movies', moviesRoutes);
app.use('/logs', logsRoutes);
app.use('/auth', authRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Claquete API rodando na porta ${PORT}`);
  });
}

module.exports = app;