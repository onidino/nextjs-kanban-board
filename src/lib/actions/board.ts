'use server';

import { db } from '../db';
import { columns, tasks } from '../db/schema';
import { desc } from 'drizzle-orm';

export async function getColumns() {
  try {
    const columnsData = await db.select().from(columns).orderBy(columns.id);
    return { data: columnsData, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch columns' };
  }
}

export async function getTasks() {
  try {
    const tasksData = await db.select().from(tasks).orderBy(tasks.order);
    return { data: tasksData, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch tasks' };
  }
} 