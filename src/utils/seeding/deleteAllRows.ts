import { sql } from "kysely";
import { db } from "../../../db";

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteAllRows() {
  await disableForeignKeyChecks();
  await sql`truncate users`.execute(db);
  await sql`truncate products`.execute(db);
  await sql`truncate categories`.execute(db);
  await sql`truncate product_categories`.execute(db);
  await sql`truncate brands`.execute(db);
  await sql`truncate reviews`.execute(db);
  await sql`truncate comments`.execute(db);
  await enableForeignKeyChecks();
}
