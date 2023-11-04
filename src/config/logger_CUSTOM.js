import winston, { transports } from "winston";
import config from "./config.js";

//Custom Logger Options DEV
const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    http: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "organge",
    warning: "yellow",
    http: "green",
    info: "blue",
    debug: "white",
  },
};

//Configuracion winston
const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "fatal",
      format: winston.format.combine(
        winston.format.colorize({
          colors: customLevelOptions.colors,
        }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({
          colors: customLevelOptions.colors,
        }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

//Middleware
export const addLogger = (req, res, next) => {
  if (config.environment === "production") {
    req.logger = prodLogger;

    req.logger.info(
      `${req.method} en ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
  } else {
    req.logger = devLogger;

    req.logger.fatal(
      `${req.method} en ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    req.logger.warning(
      `${req.method} en ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
  }

  next();
};
