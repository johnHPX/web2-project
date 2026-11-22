const request = require('supertest');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

// Simula o envio de e-mail para não depender de um serviço externo.
jest.mock('../../src/services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({
    messageId: 'test-message-id'
  })
}));

const app = require('../../src/app');
const emailService = require('../../src/services/emailService');
const requisicoesLogger = require('../../src/middlewares/requisicoesLogger');

const {
  connectDatabase,
  getDatabase,
  closeDatabase
} = require('../../src/config/database');

const createdUsersIds = [];

const senhaTeste = '123456';
const emailTeste = 'teste@claquete.com';

let codigo2FA;

async function createTestUser(email = emailTeste) {
  const db = getDatabase();
  const senhaHash = await bcrypt.hash(senhaTeste, 12);

  const result = await db.collection('users').insertOne({
    nome: 'Usuário Teste',
    email,
    senha: senhaHash,
    codigo2fa: undefined,
    expiracao2fa: undefined
  });

  createdUsersIds.push(result.insertedId);

  return result.insertedId;
}

async function loginTestUser() {
  await request(app)
    .post('/users/login')
    .send({
      email: emailTeste,
      senha: senhaTeste
    });

  codigo2FA = emailService.sendEmail.mock.calls.at(-1)[1];
}

beforeAll(async () => {
  await connectDatabase('test');
});

afterAll(async () => {
  // Aguarda os logs gerados pelas requisições.
  await requisicoesLogger.waitForPendingLogs();

  const db = getDatabase();

  if (createdUsersIds.length > 0) {
    await db.collection('users').deleteMany({
      _id: { $in: createdUsersIds }
    });
  }

  await closeDatabase();
});

describe('Users API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /users/register
  describe('POST /users/register', () => {

    test('deve cadastrar um novo usuário', async () => {
      const newUser = {
        nome: 'João',
        email: 'cadastro@claquete.com',
        senha: senhaTeste
      };

      const response = await request(app)
        .post('/users/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('_id');

      createdUsersIds.push(new ObjectId(response.body.user._id));
    });

  });

  // POST /users/login
  describe('POST /users/login', () => {

    beforeEach(async () => {
      await createTestUser();
    });

    test('deve validar as credenciais e enviar o código 2FA por e-mail', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: emailTeste,
          senha: senhaTeste
        });

      expect(response.status).toBe(200);

      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        emailTeste,
        expect.any(String)
      );
    });

    test('não deve permitir login com senha incorreta', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: emailTeste,
          senha: 'senha-incorreta'
        });

      expect(response.status).toBe(401);
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

  });

  // POST /users/verify-2fa
  describe('POST /users/verify-2fa', () => {

    beforeEach(async () => {
      await createTestUser();
      await loginTestUser();
    });

    test('deve validar corretamente o código 2FA', async () => {
      expect(codigo2FA).toEqual(expect.any(String));

      const response = await request(app)
        .post('/users/verify-2fa')
        .send({
          email: emailTeste,
          codigo: codigo2FA
        });

      expect(response.status).toBe(200);
    });

    test('não deve aceitar um código 2FA incorreto', async () => {
      const response = await request(app)
        .post('/users/verify-2fa')
        .send({
          email: emailTeste,
          codigo: '000000'
        });

      expect(response.status).toBe(400);
    });

  });

});
