'use server';

import { z } from "zod";
import { db } from "../db";
import { tasks } from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// Using the schema from schema.ts
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  assignee: z.string().min(1, "Assignee is required"),
  columnId: z.number().min(1, "Column ID is required"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export async function createTask(values: TaskFormValues) {
  try {
    // Validate the input
    const validatedData = taskFormSchema.parse(values);

    // Get the highest order in the column
    const existingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, validatedData.columnId))
      .orderBy(tasks.order);

    // Calculate the new order (highest order + 1, or 0 if no tasks)
    const newOrder = existingTasks.length > 0 
      ? Math.max(...existingTasks.map(t => t.order)) + 1 
      : 0;

    // Create the task with all required fields from the schema
    const [newTask] = await db
      .insert(tasks)
      .values({
        // Required fields from schema
        title: validatedData.title,
        columnId: validatedData.columnId,
        order: newOrder,
        // Optional fields
        description: validatedData.description,
        assignee: validatedData.assignee,
        // Timestamps are handled by the database defaults
      })
      .returning();

    // Revalidate the board page
    revalidatePath('/board/[boardId]', 'page');

    return { data: newTask, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    return { data: null, error: "Failed to create task" };
  }
}

export async function updateTask(taskId: number, values: TaskFormValues) {
  try {
    // Validate the input
    const validatedData = taskFormSchema.parse(values);

    // Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set({
        title: validatedData.title,
        description: validatedData.description,
        assignee: validatedData.assignee,
        columnId: validatedData.columnId,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Revalidate the board page with specific path
    revalidatePath('/board/[boardId]', 'page');

    return { data: updatedTask, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    return { data: null, error: "Failed to update task" };
  }
}

export async function updateTaskAssignee(taskId: number, assignee: string) {
  try {
    const [updatedTask] = await db
      .update(tasks)
      .set({ assignee })
      .where(eq(tasks.id, taskId))
      .returning();

    // Revalidate the board page
    revalidatePath('/board/[boardId]', 'page');

    return { data: updatedTask, error: null };
  } catch (error) {
    return { data: null, error: "Failed to update task assignee" };
  }
} 