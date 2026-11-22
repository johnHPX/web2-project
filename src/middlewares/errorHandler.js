const AppError = require('../utils/appErrors');

function errorHandler(error, req, res, next) {
  console.error({
    name: error.name,
    message: error.message,
    internalErrorCode: error.internalErrorCode,
    stack: error.stack,
    method: req.method,
    path: req.originalUrl
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.internalErrorCode,
        message: error.message
      }
    });
  }

  return res.status(500).json({
    error: {
      code: 0,
      message: 'Erro interno do servidor.'
    }
  });
}

module.exports = errorHandler;