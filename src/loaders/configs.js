const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT_API: Joi.number().default(8000),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
    JWT_REFRESH_EXPIRATION_MINUTES: Joi.number().default(1),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(5),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().required(),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USERNAME: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
    EMAIL_FROM: Joi.string().required(),

    AGENDA_POLL_TIME: Joi.string().default("20 seconds"),
    AGENDA_MAX_CONCURRENCY: Joi.number().default(20),
    DASH_USER: Joi.string().default("admin"),
    DASH_PASS: Joi.string().default("123123"),

    AWS_BUCKET_REGION: Joi.string().required(),
    AWS_ACCEPT_KEY: Joi.string().required(),
    AWS_PRIVATE_KEY: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) throw new Error(`Invalid env configs: ${error.message}`);

//--  GLOBAL CONFIGS
module.exports = {
  env: envVars.NODE_ENV,

  api: { prefix: "/api" },

  port: envVars.PORT_API,

  databaseURL: `mongodb://${envVars.DB_HOST}/${envVars.DB_NAME}?readPreference=primary&appname=MongoDB`,

  CORS: {
    enabled: true,
    settings: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Accept,Access-Control-Allow-Headers,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With",
    },
  },

  jsonwebtoken: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationMinutes: envVars.JWT_REFRESH_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },

  agendaQueue: {
    collection: "jobs",
    dbUrl: `mongodb://${envVars.DB_HOST}/${envVars.DB_NAME}?readPreference=primary&appname=MongoDB`,
    processEvery: envVars.AGENDA_POLL_TIME,
    maxConcurrency: envVars.AGENDA_MAX_CONCURRENCY,
    dashUser: envVars.DASH_USER,
    dashPass: envVars.DASH_PASS,
  },

  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    // from: envVars.EMAIL_FROM,
  },

  aws: {
    region: envVars.AWS_BUCKET_REGION,
    bucket: envVars.AWS_BUCKET_NAME,
    accessKeyId: envVars.AWS_ACCEPT_KEY,
    secretAccessKey: envVars.AWS_PRIVATE_KEY,
  },
};
