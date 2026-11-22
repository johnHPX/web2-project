class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.internalErrorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;