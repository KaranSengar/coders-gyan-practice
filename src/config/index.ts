import dotenv from "dotenv";
// 1️⃣ sabse pehle NODE_ENV read karo
const NODE_ENV = process.env.NODE_ENV || "development";
// 2️⃣ uske base pe correct env file load karo
dotenv.config({
  path: `.env.${NODE_ENV}`,
});
// ---- rest same ----
interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  HOSTNAME: string;
  DB_PORT: number;
  DB_NAME: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  REFRESH_TOKEN_SECRET: string;
  JWKS_URI: string;
  PRIVATE_KEY: string;
}
const config: Config = {
  PORT: Number(process.env.PORT) || 5000,
  HOSTNAME: process.env.HOSTNAME || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "testdb",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "password",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secretpoll",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "private key",
  JWKS_URI: process.env.JWKS_URI!, // required
  NODE_ENV: NODE_ENV as Config["NODE_ENV"],
};

export default config;
