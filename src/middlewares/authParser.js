const User = require('../models/user.model');
const { verifyToken } = require('../services/token.service');
const AppError = require('../utils/appError');

const tokenParser = () => {
  return async (req, res, next) => {
    // Handle authentication for token-based.
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    try {
      const decoded = await verifyToken(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.userId).lean();

      if (!currentUser) {
        return next(new AppError('This user is not found.', 403));
      }
      req.user = { ...decoded };
    } catch (err) {
      if (
        err.message === 'invalid token' ||
        err.message === 'jwt malformed' ||
        err.message === 'invalid signature'
      ) {
        return next(new AppError('Session is invalid, please try again.', 403));
      }
      //  Token expires itself within 1 minutes
      else if (
        err.message === 'jwt expired' &&
        !req.originalUrl.includes('/refresh-tokens')
      ) {
        return next(new AppError('Session was expired, please login again.', 403));
      }
      req.user = {};
    }

    return next();
  };
};

module.exports = [tokenParser()];
