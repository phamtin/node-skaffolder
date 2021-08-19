const User = require('../models/user.model');
const systemLog = require('../loaders/logger');

const AppError = require('../utils/appError');
const { pick } = require('../utils/commonFunc');
const Order = require('../models/order');

const createOrder = async (user, params) => {
  systemLog.info('Create new order - START')

  if (user.userId !== params.userId) {
    throw new AppError('This user can not create order', 403);
  }
  const orderParams = pick(params, ['price', 'userId', 'status']);
  const newOrder = new Order(orderParams)
  await newOrder.save()

  systemLog.info('Create new order - SUCCESS');
  return newOrder;
};

module.exports = {
  createOrder
};
