let movies = require('../data/moviesData');

function findAll() {
  return movies;
}

function findById(id) {
  return movies.find(movie => movie.id === id) || null;
}

function create(movieData) {
  const lastItem = movies[movies.length - 1];

  const lastNum = lastItem
    ? parseInt(lastItem.id.replace('mov', ''))
    : 0;

  const nextId = `mov${String(lastNum + 1).padStart(4, '0')}`;

  const newMovie = {
    id: nextId,
    ...movieData
  };

  movies.push(newMovie);

  return newMovie;
}

function deleteById(id) {
  const index = movies.findIndex(movie => movie.id === id);

  if (index === -1) {
    return false;
  }

  movies.splice(index, 1);

  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  deleteById
};