const express = require("express");

const userController = require("../controllers/user.controller");
const {
  getMe,
  updateUser,
  updateAva,
} = require("../validators/user.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/me", userController.getMe);
router.post("/me/avatar", validate(updateAva), userController.updateUserAvatar);

module.exports = router;
