'use server';

import { db } from '../db';
import { columns, tasks } from '../db/schema';
import { desc, eq, and, ne } from 'drizzle-orm';
import { z } from "zod";
import { revalidatePath } from 'next/cache';

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
    revalidatePath('/', 'page');

    return { data: newColumn, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    console.error('Error creating column:', error);
    return { data: null, error: "Failed to create column" };
  }
}

export async function updateColumn(columnId: number, values: ColumnFormValues) {
  try {
    // Validate the input
    const validatedData = columnFormSchema.parse(values);

    // Check if a column with the same title already exists (excluding current column)
    const existingColumn = await db
      .select()
      .from(columns)
      .where(
        and(
          eq(columns.title, validatedData.title),
          ne(columns.id, columnId)
        )
      )
      .limit(1);

    if (existingColumn.length > 0) {
      return { data: null, error: "A column with this title already exists" };
    }

    // Update the column
    const [updatedColumn] = await db
      .update(columns)
      .set({
        title: validatedData.title,
      })
      .where(eq(columns.id, columnId))
      .returning();

    // Revalidate the board page
    revalidatePath('/', 'page');

    return { data: updatedColumn, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    console.error('Error updating column:', error);
    return { data: null, error: "Failed to update column" };
  }
}

export async function deleteColumn(columnId: number) {
  try {
    // First check if the column has any tasks
    const columnTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, columnId));

    if (columnTasks.length > 0) {
      return { error: "Cannot delete column with existing tasks" };
    }

    // Delete the column
    const [deletedColumn] = await db
      .delete(columns)
      .where(eq(columns.id, columnId))
      .returning();

    if (!deletedColumn) {
      return { error: "Column not found" };
    }

    // Revalidate the board page
    revalidatePath('/', 'page');

    return { data: deletedColumn, error: null };
  } catch (error) {
    console.error('Error deleting column:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to delete column" };
  }
} 