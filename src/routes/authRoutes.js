const express = require("express");

const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/authGuard");
const validate = require("../middlewares/validate");
const {
  signin,
  logout,
  signup,
  verifyEmail,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../validators/auth.validation");

const router = express.Router();

router.post("/signup", validate(signup), authController.signup);
router.post("/login", validate(signin), authController.signin);
router.post("/logout/:id", validate(logout), authController.logout);
router.post(
  "/change-password",
  isAuthenticated(),
  validate(changePassword),
  authController.changePassword
);
router.post(
  "/refresh-tokens",
  validate(refreshToken),
  authController.refreshTokens
);
router.get("/verify-email", validate(verifyEmail), authController.verifyEmail);
router.post(
  "/forgot-password",
  validate(forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password/:token",
  validate(resetPassword),
  authController.resetPassword
);

module.exports = router;
