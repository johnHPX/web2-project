const express = require('express');
const router = express.Router();
const logs = require('../data/logsData');

router.get('/', (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ error: "Informe a data no formato YYYY-MM-DD via query string (?data=...)" });
  }

  const logsFiltrados = logs.filter(l => l.data === data);
  res.json(logsFiltrados);
});

module.exports = router;