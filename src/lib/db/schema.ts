import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const columns = pgTable('columns', {
  id:        serial('id').primaryKey(),
  title:     varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id:           serial('id').primaryKey(),
  title:        varchar('title', { length: 255 }).notNull(),
  description:  text('description'),
  columnId:     integer('column_id').references(() => columns.id).notNull(),
  order:        integer('order').notNull().default(0),
  assignee:     varchar('assignee', { length: 255 }),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type Column = typeof columns.$inferSelect;
export type Task = typeof tasks.$inferSelect; 