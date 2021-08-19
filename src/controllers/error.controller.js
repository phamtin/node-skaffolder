/**
 *  This is  minimal Error handler, consider implementing one more
 *  error handler specified for PRODUCTION env
 */

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json(responseErr({ message: err.message }));
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message ? err.message : (err.message = 'Something went wrong');
  sendErrorDev(err, req, res);
};
