const { MongoClient } = require('mongodb');

let client;
let db;
let connectionPromise;
let connectedDatabaseName;

async function connectDatabase(kind = 'development') {
  const uri = process.env.MONGODB_URI;

  const databaseName = kind === 'test'
    ? process.env.MONGODB_TEST_DATABASE
    : process.env.MONGODB_DATABASE;

  if (!uri || !databaseName) {
    throw new Error('Variáveis do MongoDB não configuradas.');
  }

  // Reutiliza a conexão somente se for para o mesmo banco.
  if (db) {
    if (connectedDatabaseName !== databaseName) {
      throw new Error(
        'Já existe uma conexão ativa com outro banco de dados.'
      );
    }

    return db;
  }

  if (!connectionPromise) {
    client = new MongoClient(uri);

    connectionPromise = client.connect()
      .then(() => {
        db = client.db(databaseName);
        connectedDatabaseName = databaseName;

        console.log(`MongoDB conectado: ${databaseName}`);

        return db;
      })
      .catch(async (error) => {
        await client.close().catch(() => { });

        client = null;
        db = null;
        connectedDatabaseName = null;
        connectionPromise = null;

        throw error;
      });
  }

  return connectionPromise;
}

function getDatabase() {
  if (!db) {
    throw new Error('Banco de dados não conectado.');
  }

  return db;
}

async function closeDatabase() {
  if (client) {
    await client.close();
  }

  client = null;
  db = null;
  connectedDatabaseName = null;
  connectionPromise = null;
}

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase
};
