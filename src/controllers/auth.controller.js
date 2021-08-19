const { catchAsync } = require("../utils/commonFunc");
const { authService, tokenService, emailService } = require("../services");

const signup = catchAsync(async (req, res) => {
  await authService.signup(req.body);
  return res.status(201).json(responseOK());
});

const signin = catchAsync(async (req, res) => {
  const { user, token } = await authService.signin(req.body);
  return res.status(200).send(responseOK({ user, token }));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  console.log(tokens);
  return res.status(200).json(responseOK(tokens));
});

const changePassword = catchAsync(async (req, res) => {
  const tokens = await authService.changePassword(req.user, req.body);
  return res.status(200).send(tokens);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return res.status(204).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return res.status(204).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  return res.status(204).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const { url, email } = await authService.verifyEmail(req.query.token);
  if (!email) res.redirect(`${url}/login`);
  return res.redirect(`${url}/login?sub=${email}`);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.params.id);
  return res.status(204).send();
});

module.exports = {
  signup,
  signin,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  refreshTokens,
};
