const express = require("express");

const { isAuthenticated } = require("../middlewares/authGuard");
const bookRoutes = require("./bookRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const S3Routes = require("./S3Routes");
const { doST } = require("../controllers/doSomething");

const router = express.Router();

/**
 *  ALL ROUTES is IMPLICITLY V1
 */

// router.get('/', doST);

router.use("/", authRoutes);

router.use(isAuthenticated());

router.use("/s3", S3Routes);

router.use("/users", userRoutes);

router.use("/orders", bookRoutes);

module.exports = router;
