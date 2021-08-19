const { pick } = require("../utils/commonFunc");
const { catchAsync } = require("../utils/commonFunc");
const orderService = require("../services/order.service");

const createBook = catchAsync(async (req, res) => {
  const order = await orderService.createBook(req.user, req.body);
  res.status(201).send(order);
});

const getBooks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await orderService.queryUsers(filter, options);
  res.send(result);
});

const getBook = catchAsync(async (req, res) => {
  const user = await orderService.getUserById(req.query);
  res.json(responseOK(user));
});

const updateBook = catchAsync(async (req, res) => {
  const user = await orderService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteBook = catchAsync(async (req, res) => {
  await orderService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const cancelOrder = catchAsync(async (req, res) => {
  await orderService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  cancelOrder,
};
