const fs = require("fs");
const Agenda = require("agenda");
const Agendash = require("agendash2");

const { agendaQueue } = require("./configs");
const systemLog = require("./logger");

const connectionOpts = {
  useUnifiedTopology: true,
  db: {
    address: agendaQueue.dbUrl,
    collection: agendaQueue.collection,
  },
  processEvery: agendaQueue.processEvery,
  maxConcurrency: agendaQueue.maxConcurrency,
};
const agenda = new Agenda(connectionOpts);

const initQueue = (app) => {
  return new Promise((resolve, reject) => {
    const tasksPath = require("path").join(__dirname, "../jobs/tasks");
    fs.readdirSync(tasksPath).forEach((file) => {
      require(`../jobs/tasks/${file}`)(agenda);
    });
    agenda.on("ready", () => {
      agenda.start();
      app.use("/dash", Agendash(agenda));
      systemLog.info("- Queue hooked up successfully");
      resolve();
    });
    agenda.on("error", (error) => {
      systemLog.error(error);
      reject();
      process.exit(1);
    });
    agenda.on("fail", (error) => {
      systemLog.error(error);
      reject();
      process.exit(1);
    });
  });
};

module.exports = { initQueue, agenda };
