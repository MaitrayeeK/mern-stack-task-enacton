import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import { Database } from "@/types/index";

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DB_NAME as string,
    host: process.env.HOST as string,
    user: process.env.USER_NAME as string,
    password: process.env.PASSWORD as string,
    connectionLimit: 999,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
