
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;

let client;
let db;
let connectionPromise;

async function connectDatabase() {
  if (db) {
    return db;
  }

  if (!uri || !databaseName) {
    throw new Error('Variáveis do MongoDB não configuradas.');
  }

  if (!connectionPromise) {
    client = new MongoClient(uri);

    connectionPromise = client.connect()
      .then(() => {
        db = client.db(databaseName);

        console.log(`MongoDB conectado: ${databaseName}`);

        return db;
      })
      .catch(async (error) => {
        connectionPromise = null;
        client = null;

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
  connectionPromise = null;
}

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase
};
