import { Router } from "express";

const loggerRouter = Router();

loggerRouter.get("/", (req, res) => {
  req.logger.fatal("ERROR FATAL! Algo salió terriblemente mal!");
  req.logger.error("Error! Algo no está bien!");
  req.logger.warning("Advertencia! Prueba de Log warning!");
  req.logger.info("Le brindamos información");
  req.logger.http("Http");
  req.logger.debug("informacion de developer");
  res.send({ message: "Prueba de logger!" });
});

export default loggerRouter;
