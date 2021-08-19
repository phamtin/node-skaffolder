const userService = require("../services/user.service");
const { catchAsync } = require("../utils/commonFunc");
const { pick } = require("../utils/commonFunc");

const updateUserAvatar = catchAsync(async (req, res) => {
  const avtUrl = await userService.updateAvatar(req.user, req.body);
  res.status(200).send(avtUrl);
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.query);
  res.json(responseOK(user));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMe = catchAsync(async (req, res) => {
  const me = await userService.getMe(req.user.userId);
  res.json(responseOK(me));
});

module.exports = {
  createUser,
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserAvatar,
};
