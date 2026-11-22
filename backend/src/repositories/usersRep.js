const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

function getCollection() {
  return getDatabase().collection('users');
}

async function create(usersData) {
  const newUser = {
    ...usersData
  };

  const result = await getCollection().insertOne(newUser);

  return {
    _id: result.insertedId,
    ...newUser
  };
}

async function findOne(email) {
  return await getCollection().findOne({
    email: email.trim().toLowerCase()
  });
}

async function update(id, userBody) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const result = await getCollection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: userBody
    }
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return await getCollection().findOne({
    _id: new ObjectId(id)
  });
}

module.exports = {
  create,
  findOne,
  update
};
