const express = require('express');

const systemLog = require('./loaders/logger');
const config = require('./loaders/configs');

const shutdownProcess = async () => {
  if (!global.isDown) {
    global.isDown = true;
    systemLog.error('----- CRASHED APPLICATION -----');
    return process.exit();
  }
};

async function startServer() {
  const app = express();

  await require('./loaders')({ app });

  /**
   *  Handle Exceptions
   */
  process.on('uncaughtException', (err) => {
    systemLog.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    systemLog.error(err.message);
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    systemLog.error('UNHANDLED REJECTION! 💥 Shutting down...');
    systemLog.error(err);
    process.exit(1);
  });
  process.on('SIGTERM', () => shutdownProcess());
  process.on('SIGINT', () => shutdownProcess());

  app
    .listen(config.port, () => {
      systemLog.info(`- Server's boosted at port ${config.port} 🚀
                                 ---------------------------------`);
    })
    .on('error', (err) => {
      systemLog.error(`----- SERVER'S DOWN 💥  -----`);
      systemLog.error(err.stack);
      process.exit(1);
    });
}

startServer();
