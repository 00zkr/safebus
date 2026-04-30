function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Username already exists. Please choose another one.' });
  }

  const status = error.status || 500;
  return res.status(status).json({
    message: error.message || 'Internal server error'
  });
}

module.exports = errorHandler;
