
require('dotenv').config();

const movies = require('../data/moviesData');

const {
  connectDatabase,
  getDatabase,
  closeDatabase
} = require('../src/config/database');

async function seedMovies() {
  try {
    await connectDatabase();

    const collection = getDatabase().collection('movies');

    const count = await collection.countDocuments();

    if (count > 0) {
      console.log('A collection já possui filmes. Seed ignorado.');
      return;
    }

    await collection.insertMany(movies);

    console.log(`${movies.length} filmes inseridos com sucesso!`);

  } catch (error) {
    console.error('Erro ao inserir filmes:', error);
    process.exitCode = 1;

  } finally {
    await closeDatabase();
  }
}

seedMovies();
