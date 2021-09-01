const jwt = require('jsonwebtoken');

const addHours = require('date-fns/addHours');
const addMinutes = require('date-fns/addMinutes');
const getUnixTime = require('date-fns/getUnixTime');

const { jsonwebtoken } = require('../loaders/configs');
const Token = require('../models/token.model');
const systemLog = require('../loaders/logger');
const AppError = require('../utils/appError');
const userService = require('./user.service');

const signToken = (userId, expires, type, secret = jsonwebtoken.secret) => {
  const payload = {
    type,
    userId,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(expires),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    user: userId,
    token,
    expires,
    type,
  });
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  systemLog.info(`${user._id} generate Auth Tokens - START`);
  const { _id } = user;

  const accessTokenExpires = addMinutes(new Date(), jsonwebtoken.accessExpirationMinutes); // 1 minutes
  const accessToken = signToken(_id, accessTokenExpires, 'access');
  const refreshTokenExpires = addMinutes(
    new Date(),
    jsonwebtoken.refreshExpirationMinutes
  ); // 1 hour
  const refreshToken = signToken(_id, refreshTokenExpires, 'refresh');

  await saveToken(refreshToken, _id, refreshTokenExpires, 'refresh');

  systemLog.info(`${user._id} generate Auth Tokens - SUCCESS`);
  return {
    access: { token: accessToken, expires: accessTokenExpires },
    refresh: { token: refreshToken, expires: refreshTokenExpires },
  };
};

const verifyToken = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });

const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);

  if (!user) throw new AppError(errors.USER_NOT_FOUND, 404);

  const expires = addMinutes(new Date(), jsonwebtoken.resetPasswordExpirationMinutes); // 5 minutes
  const resetPasswordToken = signToken(user._id, expires, 'reset-password');
  await saveToken(resetPasswordToken, user._id, expires, 'reset-password');
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = addMinutes(new Date(), jsonwebtoken.verifyEmailExpirationMinutes); // 5 minutes
  const verifyEmailToken = signToken(user._id, expires, 'verify-email');
  await saveToken(verifyEmailToken, user._id, expires, 'verify-email');

  return verifyEmailToken;
};

module.exports = {
  signToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
