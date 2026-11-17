const request = require('supertest');
const app = require('../../src/app');
const requisicoesLogger = require('../../src/middlewares/requisicoesLogger');

const { ObjectId } = require('mongodb');

const {
  connectDatabase,
  getDatabase,
  closeDatabase
} = require('../../src/config/database');

let testMovieId;
const createdMovieIds = [];

beforeAll(async () => {
  await connectDatabase('test');

  const db = getDatabase();

  const result = await db.collection('movies').insertOne({
    titulo: 'Filme de Teste',
    ano: 2026,
    nota: 8.5,
    sinopse: 'Filme utilizado nos testes de integração.',
    duracao: 120,
    generos: ['Drama'],
    diretor: 'Diretor de Teste',
    idioma: 'Português'
  });

  testMovieId = result.insertedId.toString();
});

afterAll(async () => {
  // Aguarda os logs gerados pelas requisições.
  await requisicoesLogger.waitForPendingLogs();

  const db = getDatabase();

  // Remove somente os filmes criados para os testes.
  await db.collection('movies').deleteMany({
    _id: {
      $in: [
        new ObjectId(testMovieId),
        ...createdMovieIds
      ]
    }
  });

  // Fecha a conexão após finalizar as operações.
  await closeDatabase();
});

describe('Movies API', () => {

  // GET /movies
  describe('GET /movies', () => {

    test('deve retornar status 200 e uma lista de filmes', async () => {
      const response = await request(app)
        .get('/movies');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

  });

  // GET /movies/:id
  describe('GET /movies/:id', () => {

    test('deve retornar um filme existente', async () => {
      const response = await request(app)
        .get(`/movies/${testMovieId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.titulo).toBe('Filme de Teste');
    });

    test('deve rejeitar um ID inválido', async () => {
      const response = await request(app)
        .get('/movies/id-invalido');

      expect(response.status).toBe(400);
    });

    test('deve retornar 404 para um filme inexistente', async () => {

      const id = new ObjectId().toString();

      const response = await request(app)
        .get(`/movies/${id}`);

      expect(response.status).toBe(404);
    });

  });

  // POST /movies
  describe('POST /movies', () => {

    test('deve cadastrar um novo filme', async () => {
      const newMovie = {
        titulo: 'Filme de Teste',
        ano: 2026,
        nota: 8.5,
        sinopse: 'Filme criado durante um teste de integração.',
        duracao: 120,
        generos: ['Drama'],
        diretor: 'Diretor de Teste',
        idioma: 'Português'
      };

      const response = await request(app)
        .post('/movies')
        .send(newMovie);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.titulo).toBe(newMovie.titulo);

      createdMovieIds.push(new ObjectId(response.body._id));
    });

  });

  // DELETE /movies/:id
  describe('DELETE /movies/:id', () => {

    test('deve rejeitar um ID inválido', async () => {
      const response = await request(app)
        .delete('/movies/id-invalido');

      expect(response.status).toBe(400);
    });

  });

  // GET /movies/export
  describe('GET /movies/export', () => {

    test('deve retornar um arquivo CSV', async () => {
      const response = await request(app)
        .get('/movies/export');

      expect(response.status).toBe(200);
      expect(response.headers['content-type'])
        .toMatch(/text\/csv/);

      expect(response.text).toContain('Título');
    });

  });

});
