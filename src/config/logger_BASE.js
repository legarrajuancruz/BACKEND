import winston from "winston";

//Configuracion winston
const logger = winston.createLogger({
  transports: [new winston.transport.Console({ level: "http" })],
});

//Middleware
export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
