const logsRepository = require('../repositories/logsRep');

async function createLog(logData) {
  return await logsRepository.create(logData);
}

async function getLogsByDate(data) {
  return await logsRepository.findByDate(data);
}

async function getLatestLogs(quantidade) {
  return await logsRepository.findLatest(quantidade);
}


module.exports = {
  createLog,
  getLogsByDate,
  getLatestLogs
};
