const express = require("express");

const {
  createBook,
  getBook,
  getBooks,
} = require("../validators/book.validation");
const bookController = require("../controllers/book.controller");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", validate(getBooks), bookController.getBooks);
router.post("/", validate(createBook), bookController.createBook);
router.get("/:id", validate(getBook), bookController.getBook);

module.exports = router;
