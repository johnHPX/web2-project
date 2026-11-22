const request = require('supertest');
const app = require('../../src/app');
const requisicoesLogger = require('../../src/middlewares/requisicoesLogger');

const {
  connectDatabase,
  getDatabase,
  closeDatabase
} = require('../../src/config/database');

let testLogId;

beforeAll(async () => {
  await connectDatabase('test');

  const db = getDatabase();

  const result = await db.collection('logs').insertOne({
    data: '2026-11-17',
    horario: '10:30:00',
    metodo: 'GET',
    rota: '/movies',
    statusCode: 200,
    duracao: 15
  });

  testLogId = result.insertedId;
});

afterAll(async () => {
  // Aguarda os logs gerados pelas requisições.
  await requisicoesLogger.waitForPendingLogs();

  const db = getDatabase();

  // Remove somente o log criado manualmente pelo teste.
  await db.collection('logs').deleteOne({
    _id: testLogId
  });

  // Fecha a conexão após finalizar as operações.
  await closeDatabase();
});


describe('Logs API', () => {

  // GET /logs
  describe('GET /logs', () => {

    test('deve retornar logs para uma data válida', async () => {
      const response = await request(app)
        .get('/logs')
        .query({ data: '2026-11-17' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      expect(
        response.body.some(log => log._id === testLogId.toString())
      ).toBe(true);
    });

    test('deve rejeitar uma data inválida', async () => {
      const response = await request(app)
        .get('/logs')
        .query({ data: '17-11-2026' });

      expect(response.status).toBe(400);
    });

    test('deve exigir o parâmetro data', async () => {
      const response = await request(app)
        .get('/logs');

      expect(response.status).toBe(400);
    });

  });

  // GET /logs/export
  describe('GET /logs/export', () => {

    test('deve retornar um arquivo CSV', async () => {
      const response = await request(app)
        .get('/logs/export')
        .query({ quantidade: 10 });

      expect(response.status).toBe(200);

      expect(response.headers['content-type'])
        .toMatch(/text\/csv/);

      expect(response.headers['content-disposition'])
        .toContain('attachment');

      expect(response.text).toContain('Data');
    });

    test('deve rejeitar uma quantidade inválida', async () => {
      const response = await request(app)
        .get('/logs/export')
        .query({ quantidade: 'abc' });

      expect(response.status).toBe(400);
    });

  });

});
