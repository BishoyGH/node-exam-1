const globalError = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode,
    message: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
  });
};

export default globalError;
