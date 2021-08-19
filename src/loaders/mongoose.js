const mongoose = require("mongoose");
const aws = require("aws-sdk");

const config = require("../loaders/configs");

module.exports = async () => {
  const dbInstance = await mongoose.connect(config.databaseURL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  //-- db event listener
  dbInstance.connection.on("disconnected", () => {
    console.log(`DB's been disconnected`);
  });

  dbInstance.connection.on("error", (err) => {
    console.log(`DB connection error - `, err.stack);
  });

  //--  AWS configs
  aws.config.update({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });

  return dbInstance.connection.db;
};
