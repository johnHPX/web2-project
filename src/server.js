
const app = require('./app');

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Claquete API rodando na porta ${PORT}`);
  });
}
