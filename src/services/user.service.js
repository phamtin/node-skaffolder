const User = require("../models/user.model");
const AppError = require("../utils/appError");
const systemLog = require("../loaders/logger");
const S3service = require("../services/S3.service");

const updateAvatar = async (profile, params) => {
  const { avatar } = params;
  const { userId } = profile;
  systemLog.info(`Update avatar - START - ${userId}`);

  const user = await getUserById(userId);
  if (!user) throw new AppError(errors.USER_NOT_FOUND, 404);

  if (user.avt) {
    await S3service.removeImageFromS3({ filename: user.avt });
  }

  await updateUserById(user._id, { avt: avatar });

  systemLog.info(`Update avatar - SUCCESS - ${userId}`);
  return avatar;
};

const createUser = async (userBody) => {
  return User.create(userBody);
};

const getUserById = (id) => {
  return User.findById(id).lean();
};

const findOneUser = (criteria, select) => {
  return User.findOne(criteria).select(select).lean();
};

const getMe = async (id) => {
  return User.findById(id).lean();
};

const getUserByEmail = async (email) => {
  return User.findOne({ email }).lean();
};

const updateUserById = (id, updateBody) => {
  return User.findByIdAndUpdate(id, { $set: updateBody });
};

const queryUsers = async (filter, options) => {};

const deleteUserById = async (userId) => {};

module.exports = {
  getMe,
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  findOneUser,
  updateAvatar,
};
