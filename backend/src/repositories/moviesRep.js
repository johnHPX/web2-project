const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

function getCollection() {
  return getDatabase().collection('movies');
}

async function findAll() {
  return await getCollection().find({}).toArray();
}

async function findById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await getCollection().findOne({
    _id: new ObjectId(id)
  });
}

async function create(movieData) {
  const newMovie = {
    ...movieData
  };

  const result = await getCollection().insertOne(newMovie);

  return {
    _id: result.insertedId,
    ...newMovie
  };
}

async function deleteById(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await getCollection().deleteOne({
    _id: new ObjectId(id)
  });

  return result.deletedCount > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  deleteById
};
