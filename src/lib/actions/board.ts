'use server';

import { db } from '../db';
import { columns, tasks } from '../db/schema';
import { desc } from 'drizzle-orm';
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const columnFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

type ColumnFormValues = z.infer<typeof columnFormSchema>;

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

export async function createColumn(values: ColumnFormValues) {
  try {
    // Validate the input
    const validatedData = columnFormSchema.parse(values);

    // Check if a column with the same title already exists
    const existingColumn = await db
      .select()
      .from(columns)
      .where(eq(columns.title, validatedData.title))
      .limit(1);

    if (existingColumn.length > 0) {
      return { data: null, error: "A column with this title already exists" };
    }

    // Create the column
    const [newColumn] = await db
      .insert(columns)
      .values({
        title: validatedData.title,
      })
      .returning();

    // Revalidate the board page
    revalidatePath('/board/[boardId]', 'page');

    return { data: newColumn, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    console.error('Error creating column:', error);
    return { data: null, error: "Failed to create column" };
  }
} 