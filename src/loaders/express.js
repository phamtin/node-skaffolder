const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");

require("dotenv").config();

const globalErrorHandler = require("../controllers/error.controller");
const AppError = require("../utils/appError");
const config = require("../loaders/configs");
const routes = require("../routes");
const systemLog = require("./logger");

module.exports = ({ app }) => {
  app.enable("trust proxy");

  /**
   * Handle CORS
   */
  app.use((req, res, next) => {
    let settings = Object.keys(config.CORS.settings).map((key) => {
      return [key, config.CORS.settings[key]];
    });
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");

    for (let i = 0; i < settings.length; i++) {
      res.header(settings[i][0], settings[i][1]);
    }
    if ("OPTIONS" == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  /**
   *  Built-in middlewares
   */
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  app.use(xss());
  app.use(mongoSanitize());
  app.use(compression());

  /**
   *  Application middlewares
   */
  let validators = require("../middlewares/authParser");
  if (validators && validators.length) {
    for (let i = 0; i < validators.length; i++) app.use(validators[i]);
  }

  /**
   *  API routes
   */
  app.use(config.api.prefix, routes);

  // Catch 404 and forward to error handler
  app.all("*", (req, res, next) => {
    systemLog.error(`URL not found: ${req.originalUrl}`);
    return next(new AppError(`This route is not exist on server!`, 404));
  });

  app.use(globalErrorHandler);
};
