class ApiError extends Error {
  constructor(message, type, isOperational = true, stack = '') {
    super(message);
    this.type = type;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
