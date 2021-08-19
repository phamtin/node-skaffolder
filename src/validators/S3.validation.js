const Joi = require("joi");

const getSignedUrl = {
  body: Joi.object().keys({
    photos: Joi.optional(),
  }),
};

module.exports = {
  getSignedUrl,
};
