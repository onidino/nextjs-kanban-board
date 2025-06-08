import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DB_URL) {
  throw new Error('DB_URL environment variable is not set');
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  }
}); 