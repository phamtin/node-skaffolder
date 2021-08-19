const AppError = require('../utils/appError');

const isAuthenticated = () => {
  return async (req, res, next) => {
    if (!req.user || !req.user.userId)
      return next(new AppError('Invalid credentials, Please log in again', 401));

    return next();
  };
};

module.exports = {
  isAuthenticated,
};
