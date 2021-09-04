const bcrypt = require('bcrypt');

const Token = require('../models/token.model');
const systemLog = require('../loaders/logger');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const { generateAuthTokens } = require('./token.service');
const emailService = require('./email.service');
const userService = require('./user.service');

const signup = async (data) => {
  systemLog.info('sign up - START');
  const { name, email, password, phone } = data;
  const user = await User.findOne({ email });
  if (user) {
    throw new AppError('User is exists, please log in', 400);
  }
  const newUser = new User({ name, email, phone, password });
  await newUser.save();
  delete newUser.password;

  emailService.sendVerifyEmail(newUser);

  systemLog.info('sign up - SUCCESS');
  return true;
};

const signin = async (data) => {
  systemLog.info('Sign in - START');
  const { email, password } = data;
  if (!email || !password) {
    throw new AppError(errors.INVALID_CREDENTIALS, 401);
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError(errors.USER_NOT_FOUND, 401);

  if (!user.isConfirm) {
    throw new AppError(errors.UNCONFIRM_EMAIL, 401);
  }
  if (!(await user.correctPassword(password, user.password))) {
    throw new AppError(errors.INVALID_CREDENTIALS, 401);
  }
  if (user.status === 'inactive') {
    throw new AppError(errors.USER_INACTIVE, 401);
  }
  const token = await generateAuthTokens(user);
  user.password = undefined;

  systemLog.info('Sign in - SUCCESS');
  return { user, token };
};

const refreshAuth = async (refreshToken) => {
  systemLog.info('Refresh token - START');
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    expires: { $gt: new Date() },
  }).lean();
  if (!refreshTokenDoc) {
    throw new AppError(errors.INVALID_SESSION, 403);
  }
  const user = await User.findById(refreshTokenDoc.user).lean();
  if (!user) {
    throw new AppError(errors.INVALID_CREDENTIALS, 401);
  }
  console.log({ refreshTokenDoc });
  if (!refreshTokenDoc.isPrimary) {
    //  This refresh token may used by malicious user
    await Token.deleteMany({ user: user._id });
    throw new AppError('Hack cc !', 403);
  }
  await Token.findByIdAndUpdate(refreshTokenDoc._id, {
    $set: { isPrimary: false },
  });
  return generateAuthTokens(user);
};

const changePassword = async (profile, params) => {
  systemLog.info('Change Password - START');
  const user = await User.findById(profile.userId).select('+password');

  if (!(await user.correctPassword(params.oldPassword, user.password))) {
    throw new AppError('Your current password is wrong.', 400);
  }
  user.password = params.newPassword;
  await user.save();
  systemLog.info('Change Password - SUCCESS');
  return generateAuthTokens(user);
};

const verifyEmail = async (token) => {
  systemLog.info('Verfiry Email - START');
  const verifyEmailTokenDoc = await Token.findOne({
    token,
    expires: { $gt: new Date() },
  }).lean();

  if (!verifyEmailTokenDoc) {
    throw new AppError('Verify email session was expired.', 403);
  }
  const user = await userService.getUserById(verifyEmailTokenDoc.user);
  if (!user) throw new AppError(errors.INVALID_SESSION, 403);

  const webUrl = 'http://localhost:3000';

  if (user.isConfirm) return webUrl;

  await userService.updateUserById(user._id, { isConfirm: true });
  await Token.deleteMany({ user: user._id });

  systemLog.info('Verfiry Email - SUCCESS');
  return {
    url: webUrl,
    email: user.email,
  };
};

const resetPassword = async (token, newPassword) => {
  systemLog.info('Reset password - START');

  const resetPasswordTokenDoc = await Token.findOne({
    token,
    expires: { $gt: new Date() },
  }).lean();

  if (!resetPasswordTokenDoc) {
    throw new AppError('Password resetting session was expired.', 403);
  }
  const user = await userService.getUserById(resetPasswordTokenDoc.user);

  if (!user) throw new AppError(errors.USER_NOT_FOUND, 401);

  const password = await bcrypt.hash(newPassword, 8);
  await userService.updateUserById(user._id, { password });
  await Token.deleteMany({ user: user._id });

  systemLog.info('Reset password - SUCCESS');
  return;
};

const logout = async (userId) => {
  //  Delete all refresh tokens
  await Token.deleteMany({ user: userId });
  return;
};

module.exports = {
  signin,
  logout,
  refreshAuth,
  resetPassword,
  changePassword,
  signup,
  verifyEmail,
};
