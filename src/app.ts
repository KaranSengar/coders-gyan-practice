import type { Request, Response } from "express";
import { config } from "./config/index";
import express from "express";
const server = () => {
  const app = express();

  const PORT = Number(config.PORT) || 5000;

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "kar" });
  });

  app.listen(PORT, () => {
    console.log("server is connected on port", PORT);
  });
};

export default server;
