import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const diagrams = pgTable('flowAgents_diagrams', {
  id: serial('id').primaryKey(),
  prompt: text('prompt').notNull(),
  diagram: text('diagram').notNull(),
  title: varchar('title', { length: 256 }).notNull().default('Diagrama sem título'),
  apiKey: text('api_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}); 