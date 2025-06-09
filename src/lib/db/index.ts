import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DB_URL) {
  throw new Error('DB_URL environment variable is not set');
}

const connectionString = process.env.DB_URL;

// Connection for queries
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export { db }; 