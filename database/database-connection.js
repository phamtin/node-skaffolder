const mongoose = require('mongoose');

const config = require('../src/loaders/configs');

module.exports = async () => {
  const dbInstance = await mongoose.connect(config.databaseURL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  //-- db event listener
  dbInstance.connection.on('disconnected', () => {
    console.log(`SEDDING CONNECTED TO DB`);
  });

  dbInstance.connection.on('error', (err) => {
    console.error(`SEDDING FAIL TO CONNECT DB - `, err.stack);
  });

  return dbInstance.connection.db;
};
