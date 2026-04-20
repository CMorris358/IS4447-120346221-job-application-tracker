// got from starter assignment code
// changed tasks to applications and name to company
// readded count as realised could be used for want level
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  count: integer("count").notNull().default(0),
});
