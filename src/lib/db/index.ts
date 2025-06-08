import { drizzle } from 'drizzle-orm/postgres-js';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DB_URL!;

// Connection for migrations
export const migrationClient = neon(connectionString);

// Connection for queries
const queryClient = neon(connectionString);
export const db = drizzle(queryClient, { schema }); 