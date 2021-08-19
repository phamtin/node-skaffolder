const pino = require("pino");

const isProd = process.env.NODE_ENV === "production";

class Logger {
  constructor() {
    this.name = "logger";
    this.logger = pino({
      prettyPrint: !isProd,
      colorize: !isProd,
      timestamp: () => `${pino.stdTimeFunctions.isoTime()}`,
      formatters: {
        bindings(bindings) {
          // return { pid: bindings.pid, hostname: bindings.hostname };
          return null;
        },
      },
    });
  }

  info(args) {
    this.logger.info(JSON.parse(JSON.stringify(args)));
  }

  warn(args) {
    this.logger.warn(JSON.parse(JSON.stringify(args)));
  }

  error(args) {
    this.logger.error(JSON.parse(JSON.stringify(args)));
  }
}

const systemLog = new Logger();

module.exports = systemLog;
