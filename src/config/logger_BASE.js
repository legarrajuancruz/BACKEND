import winston from "winston";

//Configuracion winston
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "http" }),
    new winston.transports.File({ filename: "./errors.log", level: "warn" }),
  ],
});

//Middleware
export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );

  req.logger.warn(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );

  next();
};
