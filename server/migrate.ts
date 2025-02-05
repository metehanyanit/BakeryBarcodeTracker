
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function runMigration() {
  console.log("Running migration...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration completed!");
  await pool.end();
}

runMigration().catch(console.error);
