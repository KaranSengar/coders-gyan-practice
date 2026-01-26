import type { Request, Response } from "express";
import express from "express";
import { logger } from "./config/logger";
import { globalErrorHandler } from "./config/globalhandler";
import config from "./config";
const server = () => {
  const app = express();

  const PORT = Number(config.PORT) || 5000;

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "kar" });
  });
  app.use(globalErrorHandler);
  app.listen(PORT, () => {
    logger.info("server is connected on port", PORT);
  });
};

export default server;
