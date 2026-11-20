const request = require('supertest');
const app = require('../src/index'); 
const mongoose = require('mongoose');

describe('Testes da Rota de Filmes (/movies)', () => {
  let filmeIdTeste;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Teste de Listagem 
  it('Deve retornar uma lista de filmes (status 200)', async () => {
    const response = await request(app).get('/movies');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste da Rota de PDF
  it('Deve gerar um arquivo PDF do catálogo (status 200)', async () => {
    const response = await request(app).get('/movies/pdf');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });

  // Teste da Rota de CSV
  it('Deve exportar os dados em formato CSV (status 200)', async () => {
    const response = await request(app).get('/movies/exportar/csv');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
  });

  // Teste de Criação (POST)
  it('Deve criar um novo filme de teste (status 201)', async () => {
    const novoFilme = {
      titulo: 'Filme Temporário do Jest',
      ano: 2024,
      nota: 10
    };

    const response = await request(app).post('/movies').send(novoFilme);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.titulo).toBe('Filme Temporário do Jest');
    
    filmeIdTeste = response.body._id; 
  });

  // Teste de Exclusão (DELETE)
  it('Deve excluir o filme de teste criado anteriormente (status 200)', async () => {
    const response = await request(app).delete(`/movies/${filmeIdTeste}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Item excluído com sucesso.");
  });

});