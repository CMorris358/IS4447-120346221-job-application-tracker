// got from starter assignment code
// changed tasks to applications and name to company
// readded count as realised could be used for want level
// added targets table to track weekly or monthly goals
// added categories table with colour for visual tagging
// added users table for login system
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  count: integer("count").notNull().default(0),
});

export const targets = sqliteTable("targets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  period: text("period").notNull(),
  targetCount: integer("target_count").notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  colour: text("colour").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// added status logs table to track application history over time
// each log links to an application and records what status it had on a date
export const applicationStatusLogs = sqliteTable("application_status_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});
