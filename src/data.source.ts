import { DataSource } from "typeorm";
import config from "./config";

//console.log(config,"ye env hai")
const AppDataSource = new DataSource({
  type: "postgres",
  host: config.HOSTNAME,
  port: config.DB_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.DB_NAME,
  synchronize: false,
  logging: false,

  entities: ["src/Entity/*.{ts,js}"],
  migrations: ["src/migrations/*.ts"],
});
export default AppDataSource;
