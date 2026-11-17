
const { getDatabase } = require('../config/database');

function getCollection() {
  return getDatabase().collection('logs');
}

async function create(logData) {
  const result = await getCollection().insertOne(logData);

  return {
    _id: result.insertedId,
    ...logData
  };
}

async function findByDate(data) {
  return await getCollection()
    .find({ data })
    .sort({ horario: -1 })
    .toArray();
}


async function findLatest(limit) {
  return await getCollection()
    .find({})
    .sort({ data: -1, horario: -1 })
    .limit(limit)
    .toArray();
}


module.exports = {
  create,
  findByDate,
  findLatest
};
