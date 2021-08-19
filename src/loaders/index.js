const path = require("path");
const { initQueue, agenda } = require("./agenda");

const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
module.exports = async ({ app }) => {
  /**
   *  Database load
   */
  await mongooseLoader();

  /**
   *  Load global
   */
  global.responseOK = (data = []) => {
    return { success: true, data };
  };
  global.responseErr = (error) => {
    return { success: false, error, data: [] };
  };
  global.errors = require(path.join(__dirname, "../../errors.js"));

  /**
   *  Load Agenda queue
   */
  await initQueue(app);

  /**
   *  Load Express app
   */
  expressLoader({ app, agenda });
};
