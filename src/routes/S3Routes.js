const express = require("express");

const S3Controller = require("../controllers/S3.controller");
const validate = require("../middlewares/validate");
const { getSignedUrl } = require("../validators/S3.validation");

const router = express.Router();

router.post(
  "/get-signed-url",
  validate(getSignedUrl),
  S3Controller.getSignedUrl
);

module.exports = router;
