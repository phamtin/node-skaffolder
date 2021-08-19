const signup = catchAsync(async (req, res) => {
  await authService.signup(req.body);
  return res.status(201).json(responseOK());
});

module.exports = {
  signup,
};
