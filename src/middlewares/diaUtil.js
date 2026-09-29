module.exports = (req, res, next) => {
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 2 || dayOfWeek === 6) {
    return res.status(403).json({ 
      error: "Acesso negado! A API está disponível apenas de segunda a sexta-feira." 
    });
  }
  next();
};