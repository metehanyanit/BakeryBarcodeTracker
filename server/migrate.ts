
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function runMigration() {
  console.log("Dropping existing tables...");
  await pool.query(`
    DROP TABLE IF EXISTS quantity_history;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS recipes;
  `);
  
  console.log("Running migration...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migration completed!");
  await pool.end();
}

runMigration().catch(console.error);
