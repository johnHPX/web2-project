const moviesRepository = require('../repositories/moviesRep');

async function getAllMovies() {
  return await moviesRepository.findAll();
}

async function getMovieById(id) {
  return await moviesRepository.findById(id);
}

async function createMovie(movieData) {
  const movie = {
    titulo: movieData.titulo,
    ano: movieData.ano,
    nota: movieData.nota,
    sinopse: movieData.sinopse,
    duracao: movieData.duracao,
    generos: Array.isArray(movieData.generos)
      ? movieData.generos
      : [movieData.generos],
    diretor: movieData.diretor,
    idioma: movieData.idioma
  };

  return await moviesRepository.create(movie);
}

async function deleteMovie(id) {
  return await moviesRepository.deleteById(id);
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie
};