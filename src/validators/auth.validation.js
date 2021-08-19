const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(32),
    name: Joi.string().min(4).max(64).required(),
    phone: Joi.string().min(4).max(16).optional(),
  }),
};

const signin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(1).max(32),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const logout = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    // token: Joi.string().required(),
    password: Joi.string().required().min(4).max(32),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().min(4).max(32),
    newPassword: Joi.string().required().min(4).max(32),
  }),
};

module.exports = {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  changePassword,
};
