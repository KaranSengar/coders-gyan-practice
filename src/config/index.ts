// src/config.ts
import dotenv from "dotenv";
dotenv.config(); // .env file load karne ke liye

// Type define kar diya taaki TypeScript error na aaye
interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  // future me aur variables add kar sakte ho
}

const config: Config = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",
};

export default config;
