
const logsRepository = require('../repositories/logsRep');

async function createLog(logData) {
  return await logsRepository.create(logData);
}

async function getLogsByDate(data) {
  return await logsRepository.findByDate(data);
}

module.exports = {
  createLog,
  getLogsByDate
};
