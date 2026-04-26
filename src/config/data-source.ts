import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,

  synchronize: false,
  logging: env.nodeEnv === "development",

  entities: ["src/modules/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: [],
});
