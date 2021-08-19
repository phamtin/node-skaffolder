const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createBook = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    price: Joi.number().required(),
    status: Joi.string()
      .required()
      .valid("requested", "created", "canceled", "processing", "delivering")
      .default("requested"),
  }),
};

const getBooks = {
  query: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBook = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const deleteBook = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  deleteBook,
};
