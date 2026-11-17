require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');

async function startServer() {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Claquete API rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

if (!process.env.VERCEL) {
  startServer();
}