import dotenv from "dotenv";

/* allowed NODE_ENV */
const ALLOWED_NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = typeof ALLOWED_NODE_ENVS[number];

const rawNodeEnv = process.env.NODE_ENV;

const NODE_ENV: NodeEnv =
  ALLOWED_NODE_ENVS.includes(rawNodeEnv as NodeEnv)
    ? (rawNodeEnv as NodeEnv)
    : "development";

dotenv.config({
  path: `.env.${NODE_ENV}`,
});

/* 🔥 helper for required env */
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} missing in .env`);
  }
  return value;
}

interface Config {
  PORT: number;
  NODE_ENV: NodeEnv;
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

  // 🔥 all required checks here
  REFRESH_TOKEN_SECRET: required("REFRESH_TOKEN_SECRET"),
  PRIVATE_KEY: required("PRIVATE_KEY"),
  JWKS_URI: required("JWKS_URI"),

  NODE_ENV,
};

export default config;
