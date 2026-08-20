import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pgClient } from "./client.js";

async function main() {
  await migrate(db, { migrationsFolder: new URL("../../drizzle", import.meta.url).pathname });
  console.log("Migrations applied.");
  await pgClient.end({ timeout: 5 });
}

main().catch(async (err) => {
  console.error(err);
  await pgClient.end({ timeout: 5 });
  process.exit(1);
});
