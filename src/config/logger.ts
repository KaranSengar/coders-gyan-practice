import winston from "winston";
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend-service" },
  transports: [
    new winston.transports.File({
      filename: "error.log",
      dirname: "logs",
      level: "error",
    }),

    new winston.transports.File({
      filename: "combined.log",
      dirname: "logs",
      level: "info",
    }),

    new winston.transports.Console({
      level: "info",
      format: winston.format.simple(),
    }),
  ],
});
